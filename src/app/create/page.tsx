"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const getPublicUrl = useMutation(api.files.getPublicUrl);
  const [imageA, setImageA] = useState("");
  const [imageB, setImageB] = useState("");
  const [errors, setErrors] = useState(defaultErrorState);
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold mb-8">Create a Thumbnail Test</h1>
      <p className="text-lg max-w-md">
        {" "}
        Create your test so that other people can vote on their favorite
        thumbnail and help you redesign or pick the best options.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get("title") as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: "please fill in this required field",
            };
          }
          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: "please fill in this required field",
            };
          }
          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "please fill in this required field",
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);
          if (hasErrors) {
            toast({
              title: "Form Errors",
              description: "Please fill fields on the page",
              variant: "destructive",
            });
            return;
          }
          const thumbnailId = await createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
          });

          router.push(`/thumbnails/${thumbnailId}`);
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Your Test Title</Label>
          <Input
            name="title"
            required
            id="title"
            type="text"
            placeholder="Label your test to make it eaiser to manage later"
            className={clsx("flex flex-col gap-4 p-2", {
              "border-red-500": errors.title,
              border: errors.title,
            })}
          />
          {errors.title && <div className="text-red-500">{errors.title} </div>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx("flex flex-col gap-4 p-2", {
              "border-red-500": errors.imageA,
              border: errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold">Test Image A</h2>
            {imageA && (
              <Image
                priority
                width="200"
                height="200"
                alt="image test a"
                src={imageA}
              />
            )}
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                const storageId = (uploaded[0].response as any).storageId;
                const publicUrl = await getPublicUrl({ storageId });

                if (publicUrl) {
                  setImageA(publicUrl);
                } else {
                  console.log("Failed to retrieve public URL");
                }
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
            {errors.imageA && (
              <div className="text-red-500">{errors.imageA} </div>
            )}
          </div>
          <div>
            <div
              className={clsx("flex flex-col gap-4 p-2", {
                "border-red-500": errors.imageA,
                border: errors.imageA,
              })}
            >
              <h2 className="text-2xl font-bold">Test Image B</h2>
              {imageB && (
                <Image
                  width="200"
                  height="200"
                  alt="image test b"
                  src={imageB}
                />
              )}
              <UploadButton
                uploadUrl={generateUploadUrl}
                fileTypes={["image/*"]}
                onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                  const storageId = (uploaded[0].response as any).storageId;
                  const publicUrl = await getPublicUrl({ storageId });

                  if (publicUrl) {
                    setImageB(publicUrl);
                  } else {
                    console.log("Failed to retrieve public URL");
                  }
                }}
                onUploadError={(error: unknown) => {
                  alert(`ERROR! ${error}`);
                }}
              />
              {errors.imageB && (
                <div className="text-red-500">{errors.imageB} </div>
              )}
            </div>
          </div>
        </div>
        <Button>Create Thumbnail Test</Button>
      </form>
    </div>
  );
}

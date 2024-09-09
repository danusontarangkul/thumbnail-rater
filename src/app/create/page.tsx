"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { usePublicImageUrl } from "@/hooks/usePublicImageUrl";
import { useSession } from "@clerk/nextjs";

const defaultErrorState = {
  title: "",
  imageA: "",
  imageB: "",
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  const [errors, setErrors] = useState(defaultErrorState);
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession();

  console.log("profile", session.session?.user.imageUrl);
  // Use the custom hook to get public URLs
  const {
    publicUrl: imageAUrl,
    loading: loadingA,
    error: errorA,
  } = usePublicImageUrl(imageA);
  const {
    publicUrl: imageBUrl,
    loading: loadingB,
    error: errorB,
  } = usePublicImageUrl(imageB);
  const profileImage = session.session?.user.imageUrl;

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
            return;
          }
          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: "please fill in this required field",
            };
            return;
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
            profileImage: profileImage,
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
            placeholder="Label your test to make it easier to manage later"
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
            {imageAUrl && (
              <Image
                priority
                width="200"
                height="200"
                alt="image test a"
                src={imageAUrl}
              />
            )}
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={["image/*"]}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                const storageId = (uploaded[0].response as any).storageId;
                setImageA(storageId);
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
                "border-red-500": errors.imageB,
                border: errors.imageB,
              })}
            >
              <h2 className="text-2xl font-bold">Test Image B</h2>
              {imageBUrl && (
                <Image
                  width="200"
                  height="200"
                  alt="image test b"
                  src={imageBUrl}
                />
              )}
              <UploadButton
                uploadUrl={generateUploadUrl}
                fileTypes={["image/*"]}
                onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                  const storageId = (uploaded[0].response as any).storageId;
                  setImageB(storageId);
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

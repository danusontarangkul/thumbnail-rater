"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Doc } from "../../../../convex/_generated/dataModel";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

export function Comments({ thumbnail }: { thumbnail: Doc<"thumbnails"> }) {
  const addComment = useMutation(api.thumbnails.addComent);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addComment({
      text: values.text,
      thumbnailId: thumbnail._id,
    })
      .then(() => {
        toast({
          title: "Comment Added",
          description: "Thanks for leaving your feedback",
          variant: "default",
        });
        form.reset();
      })
      .catch(() => {
        toast({
          title: "Something Happened",
          description: "Try again",
          variant: "destructive",
        });
      });
  }
  return (
    <div>
      <h2 className="text-4xl font-bold text-center my-8">Comments</h2>
      <div className="max-w-lg mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave a comment to help the contnet creator improve their
                    thumbnail designs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </Form>
        <div className="space-y-8 mt-12">
          {thumbnail.comments?.map((comment) => {
            return (
              <div
                key={`${comment.text}_${comment.createdAt}`}
                className="border p-4 rounded"
              >
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.profileUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div>{comment.name}</div>
                    <div>
                      {" "}
                      {formatDistance(new Date(comment.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                    <div>{comment.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

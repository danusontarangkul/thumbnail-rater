"use client";
import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { isSignedIn } = useSession();

  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {thumbnails?.map((thumbnail) => {
        return <div key={thumbnail._id}>{thumbnail.title}</div>;
      })}
    </main>
  );
}

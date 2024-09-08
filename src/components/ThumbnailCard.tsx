"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePublicImageUrl } from "@/hooks/usePublicImageUrl";
import Link from "next/link";
import { formatDistance } from "date-fns";

type ThumbnailProps = {
  thumbnail: {
    _id: string;
    title: string;
    userId: string;
    aImage: string | null;
    bImage: string | null;
    aVotes: number;
    bVotes: number;
    voteIds: string[];
    _creationTime: number; // Updated to 'number'
  };
};

export function ThumbnailCard({ thumbnail }: ThumbnailProps) {
  // Call the hook to get the image URL
  const {
    publicUrl: imageA,
    loading: loadingA,
    error: errorA,
  } = usePublicImageUrl(thumbnail.aImage);

  return (
    <Card key={thumbnail._id}>
      <CardHeader>
        <CardTitle>
          {loadingA && <p>Loading image A...</p>}
          {errorA && <p>Error loading image A</p>}
          {imageA && (
            <Image
              src={imageA}
              width="600"
              height="600"
              alt="thumbnail image"
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{thumbnail.title}</p>
        <p>
          {" "}
          {formatDistance(new Date(thumbnail._creationTime), new Date(), {
            addSuffix: true,
          })}
        </p>
        <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/thumbnails/${thumbnail._id}`}>View Results</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

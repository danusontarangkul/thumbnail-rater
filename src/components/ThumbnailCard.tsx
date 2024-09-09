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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@clerk/nextjs";
import { Doc } from "../../convex/_generated/dataModel";

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
    _creationTime: number;
    profileImage?: string;
  };
};

export function ThumbnailCard({ thumbnail }: ThumbnailProps) {
  const {
    publicUrl: imageA,
    loading: loadingA,
    error: errorA,
  } = usePublicImageUrl(thumbnail.aImage);

  const session = useSession();

  function hasVoted() {
    if (!session.session) {
      return false;
    }
    return thumbnail.voteIds.includes(session.session?.user.id);
  }

  return (
    <Card key={thumbnail._id}>
      <CardHeader>
        <CardTitle>{thumbnail.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingA && <p>Loading image A...</p>}
        {errorA && <p>Error loading image A</p>}
        {imageA && (
          <Image src={imageA} width="600" height="600" alt="thumbnail image" />
        )}
        <div className="flex gap-4 items-center mb-2">
          <Avatar>
            <AvatarImage src={thumbnail.profileImage} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <p>{thumbnail.title}</p>
        </div>
        <p>
          {formatDistance(new Date(thumbnail._creationTime), new Date(), {
            addSuffix: true,
          })}
        </p>
        <p>Votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={hasVoted() ? "outline" : "default"}
          asChild
        >
          <Link href={`/thumbnails/${thumbnail._id}`}>
            {hasVoted() ? "View Results" : "Vote"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

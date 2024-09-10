"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { usePublicImageUrl } from "@/hooks/usePublicImageUrl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Comments } from "./comments";

export default function ThumbnailPage() {
  const { thumbnailId } = useParams() as { thumbnailId: Id<"thumbnails"> };

  const voteOnThumbnail = useMutation(api.thumbnails.voteOnTHumbnail);
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });

  const session = useSession();

  const {
    publicUrl: imageA,
    loading: loadingA,
    error: errorA,
  } = usePublicImageUrl(thumbnail?.aImage ?? null);
  const {
    publicUrl: imageB,
    loading: loadingB,
    error: errorB,
  } = usePublicImageUrl(thumbnail?.bImage ?? null);

  if (!thumbnail || !session.session) {
    return <p>Loading thumbnail...</p>;
  }

  const handleVote = (
    thumbnailId: Id<"thumbnails">,
    imageId: string | null
  ) => {
    if (imageId) {
      voteOnThumbnail({ thumbnailId, imageId });
    } else {
      console.error("Image ID is null.");
    }
  };

  function getVotePercent(votes: number) {
    if (!thumbnail) {
      return 0;
    }
    const totalVotes = thumbnail.aVotes + thumbnail.bVotes;
    if (totalVotes === 0) {
      return 0;
    }
    return Math.round((votes / totalVotes) * 100);
  }

  const hasVoted = thumbnail.voteIds.includes(session.session.user.id);

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image A
          </h2>
          {loadingA && <p>Loading image A...</p>}
          {errorA && <p>Error loading image A:</p>}
          {imageA && (
            <Image
              className="w-full"
              width="600"
              height="600"
              alt="Test Image A"
              src={imageA}
            />
          )}
          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(thumbnail?.aVotes)}
                className="w-full"
              />
              <div className="text-lg">{thumbnail?.aVotes} votes</div>
            </>
          ) : (
            <Button
              size="lg"
              className="w-fit"
              onClick={() => {
                handleVote(thumbnailId, thumbnail?.aImage);
              }}
            >
              Vote A
            </Button>
          )}
        </div>
        <div className="flex items-center flex-col gap-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            Test Image B
          </h2>
          {loadingB && <p>Loading image B...</p>}
          {errorB && <p>Error loading image B:</p>}
          {imageB && (
            <Image
              className="w-full"
              width="600"
              height="600"
              alt="Test Image B"
              src={imageB}
            />
          )}
          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(thumbnail?.bVotes)}
                className="w-full"
              />
              <div className="text-lg">{thumbnail?.bVotes} votes</div>
            </>
          ) : (
            <Button
              size="lg"
              className="w-fit"
              onClick={() => {
                handleVote(thumbnailId, thumbnail?.bImage);
              }}
            >
              Vote B
            </Button>
          )}
        </div>
      </div>
      <Comments thumbnail={thumbnail} />
    </div>
  );
}

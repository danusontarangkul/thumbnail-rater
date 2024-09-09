"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ThumbnailCard } from "../../components/ThumbnailCard";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const {
    results: thumbnails,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.thumbnails.getRecentThumbnails,
    {},
    { initialNumItems: 1 }
  );

  if (!thumbnails) {
    return <p>Loading thumbnails...</p>;
  }

  return (
    <div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
        {thumbnails.map((thumbnail) => (
          <ThumbnailCard key={thumbnail._id} thumbnail={thumbnail} />
        ))}
        <Button
          className="w-full mb-24"
          disabled={status !== "CanLoadMore"}
          onClick={() => {
            loadMore(10);
          }}
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

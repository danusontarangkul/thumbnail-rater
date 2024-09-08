"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ThumbnailCard } from "../../components/ThumbnailCard";

export default function DashboardPage() {
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);

  if (!thumbnails) {
    return <p>Loading thumbnails...</p>;
  }

  const sortedThumbnails = [...thumbnails].reverse();

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {sortedThumbnails.map((thumbnail) => (
        <ThumbnailCard key={thumbnail._id} thumbnail={thumbnail} />
      ))}
    </div>
  );
}

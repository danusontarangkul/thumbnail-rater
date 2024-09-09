"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

export function Header() {
  const pay = useAction(api.stripe.pay);
  const router = useRouter();
  const user = useQuery(api.users.getUser);

  async function handleUpgradeClick() {
    const url = await pay();
    router.push(url);
  }

  const isSubscribed = user && (user.endsOn ?? 0) > Date.now();

  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        {" "}
        <div className="pl-14">ThumbnailRater</div>
        <div className="flex gap-8">
          <SignedIn>
            <Link className="link" href="/dashboard">
              Dashboard
            </Link>
            <Link className="link" href="/create">
              Create
            </Link>
            <Link className="link" href="/explore">
              Explore
            </Link>
          </SignedIn>
        </div>
        <div className="flex gap-4 items-center">
          <SignedIn>
            {!isSubscribed && (
              <Button onClick={handleUpgradeClick}>Upgrade</Button>
            )}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton></SignInButton>
          </SignedOut>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

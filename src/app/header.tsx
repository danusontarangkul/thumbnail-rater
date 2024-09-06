"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export function Header() {
  return (
    <div className="border-b">
      <div className="h-16 container flex justify-between items-center">
        {" "}
        <div className="pl-14">ThumbnailRater</div>
        <div>
          <SignedIn>
            <Link href="/create">Create Test</Link>
          </SignedIn>
        </div>
        <div className="flex gap-4 items-center">
          <SignedIn>
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

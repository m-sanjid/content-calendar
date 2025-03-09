import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const AuthButton = () => {
  return (
    <div className="flex gap-2">
      <SignedOut>
        <Link href={"/login"}>
          <Button
            className="rounded-full bg-inherit border-none shadow-none"
            variant={"secondary"}
          >
            Login
          </Button>
        </Link>
        <Link href={"/signup"}>
          <Button className="rounded-full">Sign Up</Button>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default AuthButton;

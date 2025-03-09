import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center mx-auto">
      <Link
        href={"/login"}
        className="mt-20 bg-neutral-100 dark:bg-neutral-800 flex gap-2 items-center cursor-pointer ring ring-neutral-200 dark:ring-neutral-500 py-[1.5px] text-sm font-semibold px-2 rounded-full "
      >
        <p>The future of content planing</p>
        <IconChevronRight size={15} strokeWidth={1} />
      </Link>
      <div>
        <div className="text-center font-semibold text-2xl md:text-4xl lg:text-7xl mx-auto mt-6 z-10 ">
          Plan , Schedule and Post Your Content with{" "}
          <span className="text-3xl md:text-5xl lg:text-8xl font-bold">
            ContentCal
          </span>
        </div>
        <p className="text-center mt-6 md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Seamlessly organize your content strategy across platforms with our
          AI-powered calendar. Collaborate, plan, and publish with confidence.
        </p>
      </div>
      <div className="my-10 flex gap-8">
        <Link href={"/login"}>
          <Button className="rounded-full">Get Started</Button>
        </Link>
        <Link href={"/pricing"}>
          <Button className="rounded-full" variant={"ghost"}>
            Pricing
            <IconArrowRight strokeWidth={1} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

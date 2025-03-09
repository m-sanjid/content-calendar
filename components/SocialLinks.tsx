import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const Socials = [
  { icon: <IconBrandGithub />, href: "https://github.com/m-sanjid/" },
  { icon: <IconBrandX />, href: "https://x.com/sanjid357" },
  {
    icon: <IconBrandLinkedin />,
    href: "https://www.linkedin.com/in/muhammedsanjid1/",
  },
];
const SocialLinks = ({ type = 1 }: { type: 1 | 2 }) => {
  return (
    <div
      className={`${type === 1 ? "flex gap-2" : "flex gap-1 text-muted-foreground scale-85"}`}
    >
      {Socials.map((i) => (
        <Link
          href={i.href}
          key={i.href}
          className="p-1 rounded-md hover:bg-black/20 dark:hover:bg-neutral-50/30"
        >
          {i.icon}
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;

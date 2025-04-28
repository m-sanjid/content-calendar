import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });

  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  const encodedText = encodeURIComponent(post.content);
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://yourapp.com/post/${post.id}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com/post/${post.id}`,
  };

  return NextResponse.json({ shareLinks });
}

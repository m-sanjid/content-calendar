import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, scheduledAt } = await req.json();

  const post = await prisma.post.create({
    data: { content, scheduledAt: new Date(scheduledAt) },
  });

  return NextResponse.json({ success: true, post });
}

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json({ posts });
}

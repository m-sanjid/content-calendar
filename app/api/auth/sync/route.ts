import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user data from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Failed to fetch user data from Clerk" },
        { status: 500 },
      );
    }

    const { firstName, lastName, emailAddresses } = clerkUser;

    // Get the primary email
    const email = emailAddresses?.[0]?.emailAddress || "";

    // Sync user to your DB
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { firstName, lastName, email },
      create: {
        clerkId: userId,
        firstName,
        lastName,
        email,
      },
    });

    return NextResponse.json({ message: "User synced", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

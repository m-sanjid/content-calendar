import { NextRequest, NextResponse } from "next/server";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { createEvent, fetchEvents } from "@/lib/eventService";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch events for the logged-in user
    const events = await fetchEvents(req);
    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Fetch the current user from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Failed to fetch user data from Clerk" },
        { status: 500 },
      );
    }

    const { firstName, lastName, emailAddresses } = clerkUser;
    const email = emailAddresses?.[0]?.emailAddress || "";

    // Ensure the user exists in your database
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

    // Convert priority string to enum format
    const priority = data.priority
      ? data.priority.charAt(0).toUpperCase() +
      data.priority.slice(1).toLowerCase()
      : "Medium";

    // Create the event
    const event = await createEvent(req, {
      title: data.title,
      description: data.description || "",
      date: new Date(data.date || data.startTime),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location || "",
      priority,
      tags: data.tags || [],
      color: data.color || "#000000",
      user: { connect: { id: user.id } }, 
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

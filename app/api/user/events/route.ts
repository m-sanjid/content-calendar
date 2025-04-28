// app/api/events/route.ts
import Event from "@/app/models/Event";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await Event.find({ userId });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newEvent = await Event.create({ ...body, userId });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Failed to create event", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}

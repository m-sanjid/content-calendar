import { deleteEvent, fetchEvents, updateEvent } from "@/lib/eventService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const event = await fetchEvents(req, params.id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.startTime || !data.endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Convert priority to the correct enum format (capitalized first letter)
    const priority = data.priority
      ? data.priority.charAt(0).toUpperCase() +
        data.priority.slice(1).toLowerCase()
      : "Medium";

    // Update event
    const { id } = params;
    const updatedEvent = await updateEvent(req, id, {
      title: data.title,
      description: data.description,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location,
      priority, // Using the correctly formatted priority
      tags: data.tags,
      color: data.color,
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    console.error("Failed to update event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const result = await deleteEvent(req, params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

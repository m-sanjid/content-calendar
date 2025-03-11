import { CalendarEvent } from "@/types";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient, Priority } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type RequestWithAuth = NextRequest;

// Ensure user exists in the database or create one

async function ensureUserExists(req: NextRequest): Promise<string> {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error("Unauthorized: User ID not found");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Failed to fetch user data from Clerk");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  console.log("Existing user in DB:", existingUser);

  const { firstName, lastName, emailAddresses } = clerkUser;
  const email = emailAddresses?.[0]?.emailAddress || "";

  try {
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { firstName, lastName, email },
      create: { clerkId: userId, firstName, lastName, email },
    });

    return user.id; 
  } catch (error ) {
    console.error("Error syncing user to DB:", error);
    throw new Error("Failed to sync user to database");
  }
}


async function getUserId(req: NextRequest): Promise<string> {
  const { userId: clerkUserId } = getAuth(req);

  if (!clerkUserId) {
    throw new Error("Unauthorized: User ID not found");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    throw new Error("User not found in the database");
  }

  return user.id;
}

// Fetch events
export async function fetchEvents(req: NextRequest) {
  const userId = await getUserId(req);

  try {
    const events = await prisma.calendarEvent.findMany({
      where: { userId },
      include: { recurring: true },
    });

    return events.map((event) => ({
      ...event,
      start: event.startTime,
      end: event.endTime,
      allDay: isAllDay(event.startTime, event.endTime),
      priority: event.priority.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

// Fetch a single event by ID
export async function GET(req: NextRequest) {
  try {
    const events = await fetchEvents(req);
    console.log(events);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

// Create a new event

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createEvent(req: RequestWithAuth, eventDetails: any) {
  try {
    const userId = await ensureUserExists(req);
    const { priority, recurring } = eventDetails;

    const newEvent = await prisma.calendarEvent.create({
      data: {
        ...eventDetails,
        priority: convertToPriorityEnum(priority),
        user: { connect: { id: userId } },
        ...(recurring && {
          recurring: {
            create: {
              frequency: recurring.frequency || "None",
              interval: recurring.interval || 1,
            },
          },
        }),
      },
      include: { recurring: true },
    });
    console.log("new event", newEvent);

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}

// ✏ Update an existing event
export async function updateEvent(
  req: RequestWithAuth,
  id: string,
  eventData: CalendarEvent,
) {
  const userId = await getUserId(req);

  try {
    const { recurring, ...eventDetails } = eventData;
    const priority = convertToPriorityEnum(eventDetails.priority);

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id, userId },
      data: {
        ...eventDetails,
        priority,
        ...(recurring && {
          recurring: {
            upsert: {
              create: {
                frequency: recurring.frequency || "None",
                interval: recurring.interval || 1,
              },
              update: {
                frequency: recurring.frequency || "None",
                interval: recurring.interval || 1,
              },
            },
          },
        }),
      },
      include: { recurring: true },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

export async function deleteEvent(req: RequestWithAuth, id: string) {
  const userId = await getUserId(req);

  try {
    await prisma.recurring.deleteMany({ where: { eventId: id } });
    await prisma.calendarEvent.delete({ where: { id, userId } });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
}

// Utility functions
function isAllDay(start: Date, end: Date) {
  return (
    start.getHours() === 0 &&
    start.getMinutes() === 0 &&
    end.getHours() === 23 &&
    end.getMinutes() === 59
  );
}

function convertToPriorityEnum(priority: string): Priority {
  const priorityMap: Record<string, Priority> = {
    Low: Priority.Low,
    Medium: Priority.Medium,
    High: Priority.High,
    low: Priority.Low,
    medium: Priority.Medium,
    high: Priority.High,
  };

  return priorityMap[priority] || Priority.Medium;
}

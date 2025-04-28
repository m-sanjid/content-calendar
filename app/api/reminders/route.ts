import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'You must be logged in to create reminders'
      }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const body = await req.json();
    const { contentId, time } = body;

    if (!contentId || !time) {
      return new NextResponse(JSON.stringify({ 
        error: 'Missing required fields',
        message: 'Content ID and time are required'
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Verify content ownership
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ 
        error: 'User not found',
        message: 'User account not found'
      }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const content = await prisma.content.findFirst({
      where: {
        id: contentId,
        userId: user.id,
      },
    });

    if (!content) {
      return new NextResponse(JSON.stringify({ 
        error: 'Content not found',
        message: 'The specified content was not found or you do not have permission to access it'
      }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const scheduledTime = new Date(time);
    if (isNaN(scheduledTime.getTime())) {
      return new NextResponse(JSON.stringify({ 
        error: 'Invalid time',
        message: 'The provided time is invalid'
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check if reminder already exists for this time
    const existingReminder = await prisma.reminder.findFirst({
      where: {
        contentId,
        time: scheduledTime,
      },
    });

    if (existingReminder) {
      return new NextResponse(JSON.stringify({ 
        error: 'Duplicate reminder',
        message: 'A reminder already exists for this time'
      }), { 
        status: 409,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const reminder = await prisma.reminder.create({
      data: {
        contentId,
        time: scheduledTime,
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('[REMINDER_POST]', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ 
        error: 'Unauthorized',
        message: 'You must be logged in to view reminders'
      }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ 
        error: 'User not found',
        message: 'User account not found'
      }), { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    const reminders = await prisma.reminder.findMany({
      where: {
        content: {
          userId: user.id,
          ...(contentId ? { id: contentId } : {}),
        },
      },
      orderBy: {
        time: 'asc',
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('[REMINDER_GET]', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
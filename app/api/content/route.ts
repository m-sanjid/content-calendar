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
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, platform, scheduledAt } = body;

    if (!title || !content || !platform) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    try {
      console.log('Creating content with data:', {
        title,
        description,
        content,
        platform,
        scheduledAt,
        userId: user.id,
      });

      const newContent = await prisma.content.create({
        data: {
          title,
          description,
          content,
          platform,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          userId: user.id,
        },
      });

      console.log('Content created successfully:', newContent);
      return NextResponse.json(newContent);
    } catch (dbError) {
      console.error('[CONTENT_POST_DB]', dbError);
      return new NextResponse(JSON.stringify({ 
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('[CONTENT_POST]', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
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
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    try {
      console.log('Fetching contents for user:', user.id);
      const contents = await prisma.content.findMany({
        where: {
          userId: user.id,
          ...(status ? { status } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          reminders: true,
        },
      });

      console.log('Contents fetched successfully:', contents);
      return NextResponse.json(contents);
    } catch (dbError) {
      console.error('[CONTENT_GET_DB]', dbError);
      return new NextResponse(JSON.stringify({ 
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      }), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('[CONTENT_GET]', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
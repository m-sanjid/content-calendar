import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const reminder = await prisma.reminder.findUnique({
      where: {
        id: params.id,
      },
      include: {
        content: true,
      },
    });

    if (!reminder) {
      return new NextResponse('Reminder not found', { status: 404 });
    }

    // Verify that the user owns the content
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user || reminder.content.userId !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.reminder.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[REMINDER_DELETE]', error);
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
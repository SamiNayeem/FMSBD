import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
      const userId = req.headers.get('user-id'); // User ID should be passed in headers (or use session auth)
      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }
  
      const chats = await prisma.chat.findMany({
        where: {
          participants: {
            some: { Id: Number(userId) }, // Find chats where the user is a participant
          },
        },
        include: {
          participants: true, // Optionally include participants data
          messages: true, // Optionally include messages data
        },
      });
  
      return NextResponse.json(chats, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  
  export async function POST(req: NextRequest) {
    try {
      const { participantIds }: { participantIds: number[] } = await req.json(); // Get participants' IDs from the request body
  
      if (!participantIds || participantIds.length < 2) {
        return NextResponse.json({ message: 'At least two participants are required' }, { status: 400 });
      }
  
      const newChat = await prisma.chat.create({
        data: {
          participants: {
            connect: participantIds.map((id) => ({ Id: id })), // Connect participants to the chat
          },
        },
      });
  
      return NextResponse.json(newChat, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
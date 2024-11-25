import {prisma} from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
      const { chatId, senderId, content }: { chatId: number; senderId: number; content: string } = await req.json();
  
      if (!chatId || !senderId || !content) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
      }
  
      const newMessage = await prisma.message.create({
        data: {
          chat: { connect: { id: chatId } }, // Link the message to a specific chat
          sender: { connect: { Id: senderId } }, // Link the message to a sender (user)
          content, // Set the content of the message
        },
      });
  
      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  
  export async function GET(req: NextRequest, { params }: { params: { chatId: string } }) {
    try {
      const { chatId } = params; // Get chatId from URL params
      const messages = await prisma.message.findMany({
        where: { chatId: Number(chatId) },
        orderBy: {
          createdAt: 'asc', // Order messages by creation time
        },
      });
  
      return NextResponse.json(messages, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
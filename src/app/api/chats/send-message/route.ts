// File: app/api/chats/send-message/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Recipient ID and content are required." },
        { status: 400 }
      );
    }

    // Find or create the chat between the sender and recipient
    let chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { Id: session.user.id } } },
          { participants: { some: { Id: recipientId } } },
        ],
      },
      include: {
        participants: true, // Include participants in the chat object
      },
    });

    if (!chat) {
      // Create the chat if it doesn't exist
      chat = await prisma.chat.create({
        data: {
          participants: {
            connect: [{ Id: session.user.id }, { Id: recipientId }],
          },
        },
        include: {
          participants: true, // Include participants when creating the chat
        },
      });
    }

    // Create a new message in the chat
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: session.user.id,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

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
    const { chatId, recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Recipient ID and content are required." },
        { status: 400 }
      );
    }

    // Find or create the chat
    let chat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            Id: { in: [session.user.id, recipientId] },
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          participants: {
            connect: [{ Id: session.user.id }, { Id: recipientId }],
          },
        },
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: session.user.id,
        content,
      },
    });

    // Update the chat with the last message
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
      },
    });

    // Increment the recipient's unread message count
    await prisma.users.update({
      where: { Id: recipientId },
      data: { UnreadMessages: { increment: 1 } },
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

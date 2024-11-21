// /api/chat/send-message.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, content } = await req.json();

    if (!chatId || !content.trim()) {
      return NextResponse.json(
        { error: "Chat ID and content are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: session.user.id,
        content,
      },
      include: {
        sender: {
          select: { FirstName: true, LastName: true, Image: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "An error occurred while sending the message" },
      { status: 500 }
    );
  }
}

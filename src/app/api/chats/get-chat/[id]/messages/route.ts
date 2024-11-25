// File: app/api/chats/get-chat/[id]/messages/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(params.id, 10);

  try {
    // Ensure userId is valid
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Find or create a chat between the two participants
    const chat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            Id: { in: [session.user.id, userId] },
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // If no chat exists, return an empty list of messages
    if (!chat) {
      return NextResponse.json(
        { messages: [], message: "No chat found. Start a new conversation." },
        { status: 200 }
      );
    }

    // Return chat messages
    return NextResponse.json({ messages: chat.messages }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

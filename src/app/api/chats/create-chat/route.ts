import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { participantId } = await req.json();

  try {
    const participant = await prisma.users.findUnique({
      where: { Id: participantId },
      select: { Role: true },
    });

    if (!participant || !["volunteer", "admin"].includes(participant.Role)) {
      return NextResponse.json({ error: "Cannot start chat with this user" }, { status: 403 });
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { Id: session.user.id } } },
          { participants: { some: { Id: participantId } } },
        ],
      },
    });

    if (existingChat) {
      return NextResponse.json(existingChat, { status: 200 });
    }

    const chat = await prisma.chat.create({
      data: {
        participants: { connect: [{ Id: session.user.id }, { Id: participantId }] },
      },
      include: { participants: true },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error("Error starting new chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

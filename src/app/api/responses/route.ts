import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { postId, userId, message } = await req.json();

    if (!postId || !userId || !message) {
      return NextResponse.json({ error: "Post ID, User ID, and message are required" }, { status: 400 });
    }

    const response = await prisma.response.create({
      data: {
        postId,
        userId,
        message,
      },
    });

    return NextResponse.json({ message: "Response added successfully", response }, { status: 201 });
  } catch (error) {
    console.error("Error adding response:", error);
    return NextResponse.json({ error: "Error adding response" }, { status: 500 });
  }
}


export async function GET(req: Request) {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
  
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
  
    try {
      const responses = await prisma.response.findMany({
        where: { postId: parseInt(postId) },
        include: {
          user: {
            select: {
              FirstName: true,
              LastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
  
      const formattedResponses = responses.map((response) => ({
        id: response.id,
        message: response.message,
        responderName: `${response.user.FirstName} ${response.user.LastName}`,
        timestamp: response.createdAt.toISOString(),
      }));
  
      return NextResponse.json(formattedResponses, { status: 200 });
    } catch (error) {
      console.error("Error fetching responses:", error);
      return NextResponse.json({ error: "Error fetching responses" }, { status: 500 });
    }
  }
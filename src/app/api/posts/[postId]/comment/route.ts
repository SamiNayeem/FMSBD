// app/api/posts/[postId]/comment/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;

  try {
    const body = await req.json();
    const { userId, message } = body;

    // Validation
    if (!userId || !message) {
      return NextResponse.json({ error: "User ID and message are required" }, { status: 400 });
    }

    // Find the post to which the comment is being added
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create the new comment
    const newComment = await prisma.response.create({
      data: {
        postId: parseInt(postId),
        userId,
        message,
      },
      include: {
        user: { select: { FirstName: true, LastName: true } },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "An error occurred while adding the comment" }, { status: 500 });
  }
}

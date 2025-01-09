import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  try {
    const body = await req.json();
    const { message, authorId } = body;

    // Ensure message and authorId are provided
    if (!message || !authorId) {
      return NextResponse.json({ error: "Message and authorId are required" }, { status: 400 });
    }

    // Check if author exists
    const authorExists = await prisma.users.findUnique({
      where: { Id: authorId },
    });

    if (!authorExists) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Check if post exists
    const postExists = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
    });

    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create the comment (response)
    const newComment = await prisma.response.create({
      data: {
        postId: Number(params.postId), // Ensure postId is converted to a number
        userId: authorId, // Use authorId for user who commented
        message,
      },
    });

    // Return the newly created comment
    const formattedComment = {
      id: newComment.id,
      message: newComment.message,
      volunteerName: `${authorExists.FirstName} ${authorExists.LastName}`, // Get the author's full name
      timestamp: newComment.createdAt.toISOString(),
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "An error occurred while adding the comment" }, { status: 500 });
  }
}

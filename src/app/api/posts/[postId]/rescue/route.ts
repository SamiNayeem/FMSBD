// app/api/posts/[postId]/rescue/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;

  try {
    // Find the post to mark as rescued
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update the IsActive field to 0 (rescued)
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Post marked as rescued", post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error marking post as rescued:", error);
    return NextResponse.json({ error: "An error occurred while rescuing the post" }, { status: 500 });
  }
}

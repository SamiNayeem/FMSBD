import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
      include: {
        author: true,
        responses: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { content, image } = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: Number(params.postId) },
      data: {
        content,
        imageUrl: image ? `data:image/jpeg;base64,${image}` : undefined,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { postId: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await prisma.post.delete({ where: { id: Number(params.postId) } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

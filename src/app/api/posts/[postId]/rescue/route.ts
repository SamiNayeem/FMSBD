import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const post = await prisma.post.update({
      where: { id: Number(params.postId) },
      data: { isActive: false },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error marking post as rescued:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            FirstName: true,
            LastName: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                FirstName: true,
                LastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      author: `${post.author.FirstName} ${post.author.LastName}`,
      content: post.content,
      imageUrl: post.image
        ? `data:image/jpeg;base64,${post.image.toString("base64")}`
        : null,
      responses: post.responses.map((response) => ({
        message: response.message,
        volunteerName: `${response.user.FirstName} ${response.user.LastName}`,
        timestamp: response.createdAt.toISOString(),
      })),
      timestamp: post.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}

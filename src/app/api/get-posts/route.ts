import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            Id: true,
            FirstName: true,
            LastName: true,
            Image: true, // Include the author's image
          },
        },
        responses: true,
      },
    });

    // Format posts to include author's image as Base64 string
    
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      author: {
        name: `${post.author.FirstName} ${post.author.LastName}`,
        imageUrl: post.author.Image
          ? `data:image/jpeg;base64,${post.author.Image.toString("base64")}`
          : null,
      },
      imageUrl: post.image
        ? `data:image/jpeg;base64,${post.image.toString("base64")}`
        : null,
      responses: post.responses,
      timestamp: post.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "An error occurred while fetching posts" }, { status: 500 });
  }
}

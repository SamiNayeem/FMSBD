import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, authorId, image } = body;

    if (!content || !authorId) {
      return NextResponse.json({ error: "Content and authorId are required" }, { status: 400 });
    }

    // Check if author exists
    const authorExists = await prisma.users.findUnique({
      where: { Id: authorId },
    });

    if (!authorExists) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Create the post
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
        image: image ? Buffer.from(image, "base64") : null, // Save the Base64 as Buffer
      },
      include: {
        author: {
          select: { FirstName: true, LastName: true },
        },
      },
    });

    // Return the post with a Base64 image URL if available
    const formattedPost = {
      id: newPost.id,
      author: `${newPost.author.FirstName} ${newPost.author.LastName}`,
      content: newPost.content,
      imageUrl: newPost.image
        ? `data:image/jpeg;base64,${Buffer.from(newPost.image).toString("base64")}`
        : null,
      responses: [],
      timestamp: newPost.createdAt.toISOString(),
    };

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "An error occurred while creating the post" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, authorId, image } = body;

    // Log incoming data
    console.log("Incoming request data:", body);

    // Validate required fields
    if (!content || !authorId) {
      console.error("Validation failed: Missing content or authorId");
      return NextResponse.json(
        { error: "Content and authorId are required" },
        { status: 400 }
      );
    }

    // Check if the author exists
    const authorExists = await prisma.users.findUnique({
      where: { Id: authorId },
    });

    if (!authorExists) {
      console.error("Validation failed: Author not found");
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      );
    }

    // Create the post in the database
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
        image: image ? Buffer.from(image, "base64") : null,
      },
      include: {
        author: {
          select: { FirstName: true, LastName: true },
        },
      },
    });

    // Format the post response
    const formattedPost = {
      id: newPost.id,
      author: `${newPost.author.FirstName} ${newPost.author.LastName}`,
      content: newPost.content,
      imageUrl: newPost.image
        ? `data:image/jpeg;base64,${newPost.image.toString("base64")}`
        : null,
      responses: [], // No responses initially for a new post
      timestamp: newPost.createdAt.toISOString(),
    };

    console.log("Post created successfully:", formattedPost);

    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users with basic details and their unread message counts
    const users = await prisma.users.findMany({
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Role: true,
        Image: true,
        messages: {
          where: { isRead: false }, // Assuming there's a `read` field in the Message model
          select: { id: true },
        },
      },
    });

    // Format the user data
    const usersWithDetails = users.map((user) => ({
      id: user.Id,
      firstName: user.FirstName,
      lastName: user.LastName,
      role: user.Role,
      avatar: user.Image
        ? `data:image/jpeg;base64,${Buffer.from(user.Image).toString("base64")}`
        : null,
      unreadCount: user.messages.length, // Count unread messages
    }));

    return NextResponse.json(usersWithDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching users with unread messages:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users who are either "Volunteer" or "Admin"
    const users = await prisma.users.findMany({
      // where: {
      //   OR: [
      //     { Role: "Volunteer" },
      //     { Role: "Admin" },
      //   ],
      // },
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Role: true,
        Image: true,
      },
    });

    // Convert Image buffer to Base64 string for users with an image
    const usersWithAvatars = users.map((user) => ({
      id: user.Id,
      firstName: user.FirstName,
      lastName: user.LastName,
      role: user.Role,
      avatar: user.Image
        ? `data:image/jpeg;base64,${Buffer.from(user.Image).toString("base64")}`
        : null,
    }));

    return NextResponse.json(usersWithAvatars, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

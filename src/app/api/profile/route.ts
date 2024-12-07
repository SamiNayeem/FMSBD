import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { Id: session.user.id },
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userProfile = {
      id: user.Id,
      firstName: user.FirstName,
      lastName: user.LastName,
      avatar: user.Image ? `data:image/jpeg;base64,${Buffer.from(user.Image).toString("base64")}` : null,
    };

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const image = formData.get('image') as File | null;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First Name and Last Name are required" }, { status: 400 });
    }

    const updatedData: any = { FirstName: firstName, LastName: lastName };

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      updatedData.Image = buffer;
    }

    const updatedUser = await prisma.users.update({
      where: { Id: session.user.id },
      data: updatedData,
    });

    return NextResponse.json({
      id: updatedUser.Id,
      firstName: updatedUser.FirstName,
      lastName: updatedUser.LastName,
      avatar: updatedUser.Image
        ? `data:image/jpeg;base64,${Buffer.from(updatedUser.Image).toString("base64")}`
        : null,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

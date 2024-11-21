import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_IMAGE_BASE64 = "defaultbase64";

type UserRequest = {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  PhoneNumber: string;
  Role?: string;
  Image?: string; // Base64 encoded string
};

export async function POST(req: NextRequest) {
  try {
    const {
      FirstName,
      LastName,
      Email,
      Password,
      ConfirmPassword,
      PhoneNumber,
      Role = "User",
      Image,
    } = (await req.json()) as UserRequest;

    if (!FirstName || !LastName || !Email || !Password || !ConfirmPassword || !PhoneNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (Password !== ConfirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { Email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const imageBuffer = Image
      ? Buffer.from(Image, "base64")
      : Buffer.from(DEFAULT_IMAGE_BASE64, "base64");

    const newUser = await prisma.users.create({
      data: {
        FirstName,
        LastName,
        Email,
        Password: hashedPassword,
        PhoneNumber,
        Role,
        Image: imageBuffer,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

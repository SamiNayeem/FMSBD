// app/api/users/route.ts or pages/api/users.ts (depending on your routing structure)
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // Adjust based on your project structure

export async function GET() {
  try {
    // Fetch users from the database
    const users = await prisma.users.findMany({
      select: {
        Id: true,
        FirstName: true,
        LastName: true,
        Role: true,
        Image: true, // Adjust based on what data you need
      },
    });

    // Return users as JSON
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

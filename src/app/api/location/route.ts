import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { type, name, parentId } = await req.json();

    if (!type || !name) {
      return NextResponse.json({ error: "Type and name are required" }, { status: 400 });
    }

    let data;
    switch (type) {
      case "division":
        data = await prisma.division.create({
          data: { name },
        });
        break;
      case "city":
        if (!parentId) {
          return NextResponse.json({ error: "Division ID is required for cities" }, { status: 400 });
        }
        data = await prisma.city.create({
          data: { name, divisionId: Number(parentId) },
        });
        break;
      case "area":
        if (!parentId) {
          return NextResponse.json({ error: "City ID is required for areas" }, { status: 400 });
        }
        data = await prisma.area.create({
          data: { name, cityId: Number(parentId) },
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error adding location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const parentId = url.searchParams.get("parentId");
  
    try {
      if (type === "division") {
        const divisions = await prisma.division.findMany();
        return NextResponse.json(divisions, { status: 200 });
      }
  
      if (type === "city" && parentId) {
        const cities = await prisma.city.findMany({
          where: { divisionId: Number(parentId) },
        });
        return NextResponse.json(cities, { status: 200 });
      }
  
      if (type === "area" && parentId) {
        const areas = await prisma.area.findMany({
          where: { cityId: Number(parentId) },
        });
        return NextResponse.json(areas, { status: 200 });
      }
  
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    } catch (error) {
      console.error("Error fetching location data:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  

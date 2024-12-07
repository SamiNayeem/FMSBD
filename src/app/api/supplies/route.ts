import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "Admin" && session.user.role !== "Volunteer")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { divisionId, cityId, areaId, description } = await req.json();

    if (!divisionId || !cityId || !areaId || !description) {
      return NextResponse.json(
        { error: "Division, City, Area, and Description are required" },
        { status: 400 }
      );
    }

    const supply = await prisma.supply.create({
      data: {
        divisionId: Number(divisionId),
        cityId: Number(cityId),
        areaId: Number(areaId),
        description,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(supply, { status: 201 });
  } catch (error) {
    console.error("Error adding supply:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const divisionId = url.searchParams.get("divisionId");
  const cityId = url.searchParams.get("cityId");
  const areaId = url.searchParams.get("areaId");

  try {
    let supplies;

    if (areaId) {
      supplies = await prisma.supply.findMany({
        where: { areaId: Number(areaId) },
        include: { division: true, city: true, area: true },
      });
    } else if (cityId) {
      supplies = await prisma.supply.findMany({
        where: { cityId: Number(cityId) },
        include: { division: true, city: true, area: true },
      });
    } else if (divisionId) {
      supplies = await prisma.supply.findMany({
        where: { divisionId: Number(divisionId) },
        include: { division: true, city: true, area: true },
      });
    } else {
      supplies = await prisma.supply.findMany({
        include: { division: true, city: true, area: true },
      });
    }

    if (!supplies || supplies.length === 0) {
      console.log("No supplies found.");
      return NextResponse.json({ error: "No supplies found" }, { status: 404 });
    }

    return NextResponse.json(supplies, { status: 200 });
  } catch (error) {
    console.error("Error fetching supplies:", error);  // Log the error in the server console
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

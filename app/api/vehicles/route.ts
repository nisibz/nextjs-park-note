import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        parkings: {
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error || "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

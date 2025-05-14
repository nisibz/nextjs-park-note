import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { vehicleId, floor } = await request.json();

    if (!vehicleId || !floor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newParking = await prisma.parking.create({
      data: {
        vehicleId,
        floor,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newParking);
  } catch (error) {
    console.error("Error creating parking:", error);
    return NextResponse.json(
      { error: "Failed to create parking" },
      { status: 500 },
    );
  }
}

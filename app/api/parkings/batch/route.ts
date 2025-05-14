import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const parkings = await request.json();

    if (!Array.isArray(parkings)) {
      return NextResponse.json(
        { error: "Expected array of parkings" },
        { status: 400 }
      );
    }

    const created = await prisma.parking.createMany({
      data: parkings.map(p => ({
        vehicleId: p.vehicleId,
        floor: p.floor,
        updatedAt: new Date(p.updatedAt),
      })),
    });

    return NextResponse.json({ count: created.count });
  } catch (error) {
    console.error("Batch create error:", error);
    return NextResponse.json(
      { error: "Failed to create parkings" },
      { status: 500 }
    );
  }
}

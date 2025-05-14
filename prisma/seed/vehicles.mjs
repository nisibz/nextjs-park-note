import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedVehicles() {
  try {
    const vehicles = [{ nickname: "Car" }, { nickname: "Motorcycle" }];

    for (const vehicle of vehicles) {
      await prisma.vehicle.upsert({
        where: { nickname: vehicle.nickname },
        update: {},
        create: {
          nickname: vehicle.nickname,
        },
      });
    }

    console.log("Vehicles seeded successfully!");
  } catch (error) {
    console.error("Error seeding vehicles:", error);
  }
}

export default seedVehicles;

import { PrismaClient } from "@prisma/client";
import seedVehicles from "./seed/vehicles.mjs";

const prisma = new PrismaClient();

async function seed() {
  try {
    await seedVehicles();

    console.log("All seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

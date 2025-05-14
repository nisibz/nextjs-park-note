-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parking" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "floor" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_nickname_key" ON "Vehicle"("nickname");

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

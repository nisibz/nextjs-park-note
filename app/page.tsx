"use client";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Divider,
} from "@mui/material";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import { Vehicle } from "./types";
import {
  addPendingParking,
  getAllPendingParkings,
  deletePendingParking,
  getCachedVehicles,
  cacheVehicles,
} from "./lib/idb";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const syncPendingParkings = async () => {
    const pending = await getAllPendingParkings();
    if (pending.length === 0) return;

    try {
      const response = await fetch("/api/parkings/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending),
      });

      if (response.ok) {
        await Promise.all(pending.map((p) => deletePendingParking(p.id)));

        const currentData = await getCachedVehicles();
        const updatedCache = currentData.map((v) => ({
          ...v,
          parkings: v.parkings.filter((p) => !p.id.startsWith("pending-")),
        }));
        await cacheVehicles(updatedCache);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }

    const updatedData = await fetch("/api/vehicles").then((res) => res.json());
    await cacheVehicles(updatedData);
    setVehicles(updatedData);
  };

  useEffect(() => {
    if (isOnline) {
      syncPendingParkings();
    }
  }, [isOnline]);

  const loadData = useCallback(async () => {
    if (!isClient) return;
      try {
        let data: Vehicle[];

        if (isOnline) {
          const response = await fetch("/api/vehicles");
          data = await response.json();
          await cacheVehicles(data);
        } else {
          data = await getCachedVehicles();
        }

        const pendingParkings = await getAllPendingParkings();
        const mergedData = data.map((vehicle) => ({
          ...vehicle,
          parkings: [
            ...pendingParkings
              .filter((p) => p.vehicleId === vehicle.id)
              .map((p) => ({
                id: `pending-${p.id}`,
                vehicleId: p.vehicleId,
                floor: p.floor,
                updatedAt: p.updatedAt,
              })),
            ...vehicle.parkings,
          ].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        }));

        setVehicles(mergedData);
        setLoading(false);
      } catch (error) {
        console.error("Data loading error:", error);
        setLoading(false);
      }
  }, [isOnline, isClient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleParkingCreate = async (vehicleId: string, floor: string) => {
    const newParking = {
      vehicleId,
      floor,
      updatedAt: new Date().toISOString(),
    };

    if (!isOnline) {
      await addPendingParking(newParking);

      setVehicles(
        (prev) =>
          prev?.map((v) =>
            v.id === vehicleId
              ? {
                  ...v,
                  parkings: [
                    {
                      id: `pending-${Date.now()}`,
                      ...newParking,
                    },
                    ...v.parkings,
                  ],
                }
              : v,
          ) || null,
      );

      const currentData = await getCachedVehicles();
      const updatedCache = currentData.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              parkings: [
                {
                  id: `pending-${Date.now()}`,
                  ...newParking,
                },
                ...v.parkings,
              ],
            }
          : v,
      );
      await cacheVehicles(updatedCache);

      return;
    }

    try {
      const response = await fetch("/api/parkings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId, floor }),
      });

      if (!response.ok) {
        throw new Error("Failed to create parking");
      }

      const updatedData = await fetch("/api/vehicles").then((res) =>
        res.json(),
      );
      await cacheVehicles(updatedData);
      setVehicles(updatedData);
    } catch (error) {
      console.error("Parking creation error:", error);
    }
  };

  if (!isClient) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ my: 4 }}>Park noted</Typography>
      {!isOnline && (
        <Typography color="error" sx={{ mb: 2 }}>
          Offline mode - changes will be synced when online
        </Typography>
      )}

      {loading ? (
        <CircularProgress />
      ) : vehicles ? (
        <Box style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
          {vehicles.map((vehicle, index) => (
            <React.Fragment key={vehicle.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Typography>{vehicle.nickname}</Typography>
                {Array.from({ length: 5 }, (_, i) => (
                  <Button
                    variant={
                      vehicle.parkings[0]?.floor === (i + 2).toString()
                        ? "contained"
                        : "outlined"
                    }
                    size="large"
                    sx={{ p: 4 }}
                    key={i + 2}
                    onClick={() =>
                      handleParkingCreate(vehicle.id, (i + 2).toString())
                    }
                  >
                    {i + 2}
                  </Button>
                ))}
              </Box>
              {index < vehicles.length - 1 && (
                <Divider orientation="vertical" />
              )}
            </React.Fragment>
          ))}
        </Box>
      ) : (
        <Typography color="error">No vehicles found</Typography>
      )}
    </Container>
  );
}

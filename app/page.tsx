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
import { useEffect, useState } from "react";

interface Parking {
  id: string;
  vehicleId: string;
  floor: string;
  updatedAt: string;
}

interface Vehicle {
  id: string;
  nickname: string;
  parkings: Parking[];
}

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleParkingCreate = async (vehicleId: string, floor: string) => {
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

      // Refresh vehicle data
      const updatedData = await fetch("/api/vehicles").then((res) =>
        res.json(),
      );
      setVehicles(updatedData);
    } catch (error) {
      console.error("Parking creation error:", error);
    }
  };

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setVehicles(data);
        setLoading(false);
      });
  }, []);

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

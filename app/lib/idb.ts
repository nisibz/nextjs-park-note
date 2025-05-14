import { openDB, DBSchema } from "idb";
import { Vehicle } from "../types";

interface OfflineDB extends DBSchema {
  pendingParkings: {
    key: string;
    value: {
      id: string;
      vehicleId: string;
      floor: string;
      updatedAt: string;
    };
  };
  vehiclesCache: {
    key: string;
    value: Vehicle;
    indexes: { byNickname: string };
  };
}

const DB_NAME = "offlineParkings";
const DB_VERSION = 2;

const getDB = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pendingParkings")) {
        db.createObjectStore("pendingParkings", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("vehiclesCache")) {
        const store = db.createObjectStore("vehiclesCache", { keyPath: "id" });
        store.createIndex("byNickname", "nickname", { unique: true });
      }
    },
  });
};

export async function addPendingParking(
  parking: Omit<OfflineDB["pendingParkings"]["value"], "id">,
) {
  const db = await getDB();
  if (!db) return null;
  return db.put("pendingParkings", {
    ...parking,
    id: Date.now().toString(),
  });
}

export async function getAllPendingParkings() {
  const db = await getDB();
  if (!db) return [];
  return db.getAll("pendingParkings");
}

export async function deletePendingParking(id: string) {
  const db = await getDB();
  if (!db) return null;
  return db.delete("pendingParkings", id);
}

export async function cacheVehicles(vehicles: Vehicle[]) {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction("vehiclesCache", "readwrite");
  await tx.store.clear();
  await Promise.all(vehicles.map((vehicle) => tx.store.put(vehicle)));
  await tx.done;
}

export async function getCachedVehicles() {
  const db = await getDB();
  if (!db) return [];
  return db.getAll("vehiclesCache");
}

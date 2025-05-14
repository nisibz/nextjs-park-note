export interface Parking {
  id: string;
  vehicleId: string;
  floor: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  nickname: string;
  parkings: Parking[];
}

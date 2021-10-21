import { WorkshopCard } from "./workshop.model";

export class Favorite {
  id?: number;
  workshopId: number;
  userId?: string;

  constructor(workshopId: number, userId: string) {
    this.workshopId = workshopId;
    this.userId = userId;
  }
}

export interface WorkshopFavoriteCard {
  totalAmount: number,
  entities: WorkshopCard[]
}
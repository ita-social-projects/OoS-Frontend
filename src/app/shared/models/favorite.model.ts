import { WorkshopCard } from './workshop.model';
export class Favorite {
  id?: string;
  workshopId: string;
  userId?: string;

  constructor(workshopId: string, userId: string) {
    this.workshopId = workshopId;
    this.userId = userId;
  }
}

export class Favorite {
  id?: number;
  workshopId: number;
  userId?: string;

  constructor(workshopId, userId) {
    this.workshopId = workshopId;
    this.userId = userId;
  }
}
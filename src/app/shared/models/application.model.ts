export class Application {
  id: number;
  status: number;
  creationTime: Date;
  workshopId: number;
  childId: number;
  userId: string

  constructor(childId, workshopId) {
    this.childId = childId;
    this.workshopId = workshopId;
  }
}
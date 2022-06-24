import { Workshop } from "./workshop.model";

export class Achievement {
  id?: string;
  title: string;
  achievementDate: Date;
  workshopId: string;
  achievementTypeId: string;
  childrenIDs: string[];
  teachers: string[];

  constructor(title: string, workshop: Workshop) {
    this.title = title;
    this.workshopId = workshop.id;
  }
}

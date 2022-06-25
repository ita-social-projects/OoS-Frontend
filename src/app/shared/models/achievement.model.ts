import { Workshop } from "./workshop.model";

export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs: string[];
  teachers: string[];

  constructor(title: string, workshopId: string, teachers?: string[]) {
    this.title = title;
    this.workshopId = workshopId;
    this.teachers = teachers;
  }
}

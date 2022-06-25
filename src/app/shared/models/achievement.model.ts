import { Workshop } from "./workshop.model";

export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs: string[];
  teachers: string[];

  constructor(title: string, workshop?: Workshop, teachers?: string[]) {
    this.title = title;
    // this.workshopId = workshop.id;
    // this.teachers = teachers;
  }
}

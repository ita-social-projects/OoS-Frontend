import { Workshop } from "./workshop.model";

export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs: string[];
  teachers: string[];

<<<<<<< HEAD
  constructor(title: string) {
=======
  constructor(title: string, workshop?: Workshop, teachers?: string[]) {
>>>>>>> d235d115d8a8940e0cb2f30374c723373f8d04f5
    this.title = title;
    // this.workshopId = workshop.id;
    // this.teachers = teachers;
  }
}

import { Child } from "./child.model";
import { Teacher } from "./teacher.model";
import { Workshop } from "./workshop.model";

export class Achievement {
  id: string;
  title: string;
  achievementDate: Date;
  workshopId: string;
  achievementTypeId: string;
  children: Child[];
  teachers: Teacher[];

  constructor(workshop: Workshop, children: Child[], teachers: Teacher[]) {
    this.workshopId = workshop.id;
    this.teachers = teachers;
    this.children = children;
  }
}

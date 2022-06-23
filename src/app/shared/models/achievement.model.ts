import { Child } from "./child.model";
import { Teacher } from "./teacher.model";
import { Workshop } from "./workshop.model";

export class Achievement {
  id: string;
  title?: string;
  achievementDate: Date;
  workshopId: string;
  achievementTypeId: string;
  children: Child[];
  teachers: Teacher[];

  constructor(title: string, workshop: Workshop, children: Child[]) {
    this.title = title;
    this.workshopId = workshop.id;
    this.children = children;
  }
}

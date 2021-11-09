import { Child } from './child.model';
import { Parent } from './parent.model';
import { Workshop, WorkshopCard } from './workshop.model';
export class Application {
  id: string;
  status: string;
  creationTime: Date;
  workshopId: string;
  childId: string;
  parentId: string;
  workshop: WorkshopCard;
  child: Child;
  parent: Parent;

  constructor(child: Child, workshop: Workshop, parent: Parent) {
    this.childId = child.id;
    this.workshopId = workshop.id;
    this.parentId = parent.id;
  }
}

export class ApplicationUpdate {
  id: string;
  status: string;

  constructor(id, status) {
    this.id = id;
    this.status = status;
  }
}

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
  reason: string;

  constructor(child: Child, workshop: Workshop, parent: Parent, reason?: string) {
    this.childId = child.id;
    this.workshopId = workshop.id;
    this.parentId = parent.id;
    this.reason = reason || "";
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

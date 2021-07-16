import { Child } from "./child.model";
import { Parent } from "./parent.model";
import { Workshop } from "./workshop.model";

export class Application {
  id: number;
  status: number;
  creationTime: Date;
  workshopId: number;
  childId: number;
  parentId: number;
  workshop: Workshop;
  child: Child;
  parent: Parent;

  constructor(child: Child, workshop: Workshop, parent: Parent) {
    this.childId = child.id;
    this.workshopId = workshop.id;
    this.parentId = parent.id;
  }
}

export class ApplicationUpdate {
  id: number;
  status: number;

  constructor(id, status) {
    this.id = id;
    this.status = status;
  }
}
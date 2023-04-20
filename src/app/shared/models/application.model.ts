import { ApplicationStatuses } from './../enum/statuses';
import { ApplicationEntityType } from '../enum/applications';
import { Child } from './child.model';
import { ParentWithContactInfo } from './parent.model';
import { Workshop, WorkshopCard } from './workshop.model';
import { PaginationParameters } from './queryParameters.model';

export class Application {
  id: string;
  status: string;
  creationTime: Date;
  approvedTime: Date;
  workshopId: string;
  childId: string;
  parentId: string;
  workshop: WorkshopCard;
  child: Child;
  parent: ParentWithContactInfo;
  rejectionMessage: string;
  isBlocked: boolean;

  constructor(child: Child, workshop: Workshop, parent: ParentWithContactInfo) {
    this.childId = child.id;
    this.workshopId = workshop.id;
    this.parentId = parent.id;
  }
}

export class ApplicationUpdate {
  id: string;
  workshopId?: string;
  parentId?: string;
  status: string;
  rejectionMessage: string;

  constructor(application: Application, status: string, rejectionMessage?: string) {
    this.id = application.id;
    this.workshopId = application.workshopId;
    this.parentId = application.parentId;
    this.status = status;
    this.rejectionMessage = rejectionMessage;
  }
}

export interface ApplicationFilterParameters extends PaginationParameters {
  searchString?: string;
  property?: ApplicationEntityType;
  statuses: ApplicationStatuses[];
  showBlocked: boolean;
  orderByDateAscending?: boolean;
  orderByAlphabetically?: boolean;
  orderByStatus?: boolean;
  workshops?: string[];
  children?: string[];
}

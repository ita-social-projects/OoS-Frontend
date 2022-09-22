import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { EntityType } from '../enum/role';
import { Child } from './child.model';
import { ParentWithContactInfo } from './parent.model';
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
  status: string;
  rejectionMessage: string;

  constructor(id: string, status: string, rejectionMessage?: string) {
    this.id = id;
    this.status = status;
    this.rejectionMessage = rejectionMessage;
  }
}
export interface ApplicationCards {
  totalAmount: number;
  entities: Application[];
}

export interface ApplicationParameters {
  property?: EntityType;
  statuses: ApplicationStatus[];
  showBlocked: boolean;
  orderByDateAscending?: boolean;
  orderByAlphabetically?: boolean;
  orderByStatus?: boolean;
  workshops?: string[];
  children?: string[];
  from?: number;
  size?: number;
}


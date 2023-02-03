import { Role } from '../enum/role';
import { Parent, ParentWithContactInfo } from './parent.model';
import { PaginationParameters } from './queryParameters.model';
import { User } from './user.model';
import { WorkshopTruncated } from './workshop.model';

export interface IncomingMessage {
  id: string;
  chatRoomId: string;
  text: string;
  senderRoleIsProvider: boolean;
  createdDateTime: string;
  readDateTime?: string;
}

export class OutgoingMessage {
  workshopId: string;
  parentId: string;
  text: string;

  constructor(workshopId: string, parentId: string, text: string) {
    this.workshopId = workshopId;
    this.parentId = parentId;
    this.text = text;
  }
}

export class ChatRoom {
  id: string;
  workshopId: string;
  parentId: string;
  workshop: WorkshopTruncated;
  parent: ParentWithContactInfo;
  notReadByCurrentUserMessagesCount?: number;
  lastMessage?: IncomingMessage;

  constructor(workshop: WorkshopTruncated, user: User, parent: Parent) {
    this.workshopId = workshop.id;
    this.workshop = workshop;
    this.parentId = parent.id;
    this.parent = { ...user, id: parent.id };
  }
}

export interface MessagesParameters {
  from: number;
  size: number;
}

export interface ChatRoomsParameters extends PaginationParameters {
  role: Role;
  searchText: string;
  workshopIds: string[];
}

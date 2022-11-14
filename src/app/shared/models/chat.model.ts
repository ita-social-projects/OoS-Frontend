import { Parent, ParentWithContactInfo } from './parent.model';
import { User } from './user.model';
import { WorkshopTruncated } from './workshop.model';

export class Message {
  id: string;
  chatRoomId: string;
  text: string;
  senderRoleIsProvider: boolean;
  createdDateTime: string;
  readDateTime?: string;

  constructor(message) {
    this.id = message.Id;
    this.chatRoomId = message.ChatRoomId;
    this.text = message.Text;
    this.createdDateTime = message.CreatedDateTime;
    this.senderRoleIsProvider = message.SenderRoleIsProvider;
    this.readDateTime = message.ReadDateTime;
  }
}

export class SendMessage {
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
  lastMessage?: Message;

  constructor(workshop: WorkshopTruncated, user: User, parent: Parent) {
    this.workshopId = workshop.id;
    this.workshop = workshop;
    this.parentId = parent.id;
    this.parent = user;
    //Replace userId with parentId
    this.parent.id = parent.id;
  }
}

export interface MessagesParameters {
  from: number;
  size: number;
}

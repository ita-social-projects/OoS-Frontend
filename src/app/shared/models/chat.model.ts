import { Parent } from './parent.model';
import { Workshop } from './workshop.model';

export interface Message {
  id: string;
  chatRoomId: string;
  text: string;
  senderRoleIsProvider: boolean;
  createdDateTime: string;
  readDateTime?: string;
}

export interface ChatRoom {
  id: string;
  workshopId: string;
  parentId: string;
  workshop: Workshop;
  parent: Parent;
  notReadByCurrentUserMessagesCount?: number;
  lastMessage?: Message;
}

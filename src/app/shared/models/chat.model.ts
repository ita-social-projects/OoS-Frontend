import { ParentWithContactInfo } from './parent.model';
import { WorkshopTruncated } from './workshop.model';

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
  workshop: WorkshopTruncated;
  parent: ParentWithContactInfo;
  notReadByCurrentUserMessagesCount?: number;
  lastMessage?: Message;
}

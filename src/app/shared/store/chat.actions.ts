import { Role } from '../enum/role';
import { MessagesParameters } from '../models/chat.model';

export class GetUserChatRooms {
  static readonly type = '[chat] Get User Chat Rooms';
  constructor(public userRole: Role) {}
}

export class GetChatRoomMessages {
  static readonly type = '[chat] Get Chat Room Messages';
  constructor(public chatRoomId: string, public role: Role, public parameters: MessagesParameters) {}
}

export class GetChatRoomById {
  static readonly type = '[chat] Get Chat Room By Id';
  constructor(public chatRoomId: string, public role: Role) {}
}

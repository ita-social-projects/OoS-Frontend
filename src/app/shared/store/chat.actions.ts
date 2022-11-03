import { Role } from '../enum/role';
import { MessagesParameters } from '../models/chat.model';

export class GetUserChatRooms {
  static readonly type = '[chat] Get User Chat Rooms';
  constructor(public userRole: Role) {}
}

export class GetChatRoomMessages {
  static readonly type = '[chat] Get Chat Room Messages';
  constructor(
    public chatRoomId: string,
    public parameters: MessagesParameters
  ) {}
}

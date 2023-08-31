import { Role } from '../enum/role';
import { ChatRoomsParameters, MessagesParameters } from '../models/chat.model';

export class GetUserChatRooms {
  static readonly type = '[chat] Get User Chat Rooms';
  constructor(public parameters: ChatRoomsParameters) {}
}

export class GetChatRoomMessages {
  static readonly type = '[chat] Get Chat Room Messages';
  constructor(public chatRoomId: string, public role: Role, public parameters: MessagesParameters) {}
}

export class GetChatRoomMessagesByWorkshopId {
  static readonly type = '[chat] Get Chat Room Messages By Workshop Id';
  constructor(public workshopId: string, public role: Role, public parameters: MessagesParameters) {}
}

export class GetChatRoomById {
  static readonly type = '[chat] Get Chat Room By Id';
  constructor(public chatRoomId: string, public role: Role) {}
}

export class ClearSelectedChatRoom {
  static readonly type = '[chat] Clear Selected Chat Room';
  constructor() {}
}

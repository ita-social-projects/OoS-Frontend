import { Role } from '../enum/role';
import { ChatRoomsParameters, MessagesParameters } from '../models/chat.model';

export class GetChatRooms {
  static readonly type = '[chat] Get Chat Rooms';

  constructor(public parameters: ChatRoomsParameters) {}
}

export class GetChatRoomForProviderByParentIdAndWorkshopId {
  static readonly type = '[chat] Get Chat Rooms For Provider By Parent Id And Workshop Id';

  constructor(public parentId: string, public workshopId: string) {}
}

export class GetChatRoomById {
  static readonly type = '[chat] Get Chat Room By Id';

  constructor(public role: Role, public chatRoomId: string) {}
}

export class GetChatRoomForParentByWorkshopId {
  static readonly type = '[chat] Get Chat Room For Parent By Workshop Id';

  constructor(public workshopId: string) {}
}

export class GetChatRoomMessagesById {
  static readonly type = '[chat] Get Chat Room Messages By Id';

  constructor(public role: Role, public chatRoomId: string, public parameters: MessagesParameters) {}
}

export class GetChatRoomMessagesForParentByWorkshopId {
  static readonly type = '[chat] Get Chat Room Messages For Parent By Workshop Id';

  constructor(public workshopId: string, public parameters: MessagesParameters) {}
}

export class ClearSelectedChatRoom {
  static readonly type = '[chat] Clear Selected Chat Room';

  constructor() {}
}

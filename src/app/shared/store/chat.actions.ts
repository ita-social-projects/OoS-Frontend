import { Role } from '../enum/role';

export class GetUserChatRooms {
  static readonly type = '[chat] Get User Chat Rooms';
  constructor(public userRole: Role) {}
}

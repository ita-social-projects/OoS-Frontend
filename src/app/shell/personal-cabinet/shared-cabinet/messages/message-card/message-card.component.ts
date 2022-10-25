import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Role } from 'src/app/shared/enum/role';
import { ChatRoom } from 'src/app/shared/models/chat.model';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements OnInit {
  readonly Role = Role;
  readonly constants = Constants;

  parentFullName: string;

  @Input() chatroom: ChatRoom;
  @Input() userRole: Role;

  constructor() {}

  ngOnInit(): void {
    this.parentFullName = Util.getFullName(this.chatroom.parent);
    this.chatroom.notReadByCurrentUserMessagesCount;
  }
}

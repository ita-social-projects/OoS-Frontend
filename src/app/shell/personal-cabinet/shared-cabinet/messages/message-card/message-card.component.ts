import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.parentFullName = Util.getFullName(this.chatroom.parent);
    this.chatroom.notReadByCurrentUserMessagesCount;
  }

  onBlock(): void {
    this.block.emit(this.chatroom.parentId);
  }

  onUnBlock(): void {
    this.unblock.emit(this.chatroom.parentId);
  }
}

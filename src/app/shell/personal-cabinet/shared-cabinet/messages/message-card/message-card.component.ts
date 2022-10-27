import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '../../../../../shared/constants/constants';
import { Role } from '../../../../../shared/enum/role';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent {
  readonly Role = Role;
  readonly constants = Constants;

  @Input() chatRoom: ChatRoom;

  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  constructor() {}

  onBlock(): void {
    this.block.emit(this.chatRoom.parentId);
  }

  onUnBlock(): void {
    this.unblock.emit(this.chatRoom.parentId);
  }
}

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Constants } from '../../../../../shared/constants/constants';
import { Role } from '../../../../../shared/enum/role';
import { ChatRoom } from '../../../../../shared/models/chat.model';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements AfterViewInit {
  readonly Role = Role;
  readonly constants = Constants;

  @Input() chatRoom: ChatRoom;
  @Input() role: Role;

  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  @ViewChildren('stopPropagation') stopPropagationElements: MatIcon[];

  constructor() {}
  ngAfterViewInit(): void {
    this.stopPropagationElements.forEach((el: MatIcon) => {
      el._elementRef.nativeElement.onclick = (event: PointerEvent) => {
        event.stopPropagation();
      };
    });
  }

  onBlock(): void {
    this.block.emit(this.chatRoom.parentId);
  }

  onUnBlock(): void {
    this.unblock.emit(this.chatRoom.parentId);
  }
}

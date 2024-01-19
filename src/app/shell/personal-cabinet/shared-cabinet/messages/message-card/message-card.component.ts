import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Constants } from '../../../../../shared/constants/constants';
import { Role } from '../../../../../shared/enum/role';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { UserStatusesTitles } from 'shared/enum/enumUA/statuses';
import { UserStatusIcons, UserStatuses } from 'shared/enum/statuses';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements AfterViewInit {
  public readonly Role = Role;
  public readonly constants = Constants;
  public readonly userStatusesTitles = UserStatusesTitles;
  public readonly userStatusIcons = UserStatusIcons;
  public readonly userStatuses =UserStatuses;

  @Input() public chatRoom: ChatRoom;
  @Input() public role: Role;

  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();

  @ViewChildren('stopPropagation') public stopPropagationElements: MatIcon[];

  constructor() {}

  public ngAfterViewInit(): void {
    this.stopPropagationElements.forEach((el: MatIcon) => {
      el._elementRef.nativeElement.onclick = (event: PointerEvent) => {
        event.stopPropagation();
      };
    });
  }

  public onBlock(): void {
    this.block.emit(this.chatRoom.parentId);
  }

  public onUnBlock(): void {
    this.unblock.emit(this.chatRoom.parentId);
  }
}

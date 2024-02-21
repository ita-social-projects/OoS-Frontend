import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UserStatusesTitles } from 'shared/enum/enumUA/statuses';
import { UserStatusIcons, UserStatuses } from 'shared/enum/statuses';
import { Constants } from '../../../../../shared/constants/constants';
import { Role } from '../../../../../shared/enum/role';
import { ChatRoom } from '../../../../../shared/models/chat.model';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss']
})
export class MessageCardComponent implements AfterViewInit {
  @Input() public chatRoom: ChatRoom;
  @Input() public role: Role;

  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();

  @ViewChildren('stopPropagation') public stopPropagationElements: MatIcon[];

  public readonly Role = Role;
  public readonly constants = Constants;
  public readonly userStatusesTitles = UserStatusesTitles;
  public readonly userStatusIcons = UserStatusIcons;
  public readonly userStatuses = UserStatuses;

  public ngAfterViewInit(): void {
    this.stopPropagationElements.forEach((el: MatIcon) => {
      el._elementRef.nativeElement.onclick = (event: PointerEvent): void => {
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

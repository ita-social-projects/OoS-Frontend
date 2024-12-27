import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

import { Constants } from 'shared/constants/constants';
import { UserStatusesTitles } from 'shared/enum/enumUA/statuses';
import { Role } from 'shared/enum/role';
import { UserStatusIcons, UserStatuses } from 'shared/enum/statuses';
import { ChatRoom } from 'shared/models/chat.model';
import { isRoleProvider } from 'shared/utils/provider.utils';

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
  public readonly Constants = Constants;
  public readonly UserStatusesTitles = UserStatusesTitles;
  public readonly UserStatusIcons = UserStatusIcons;
  public readonly UserStatuses = UserStatuses;
  public readonly isRoleProvider = isRoleProvider;

  constructor(private translateService: TranslateService) {}

  public get currentLanguage(): string {
    return this.translateService.currentLang;
  }

  public ngAfterViewInit(): void {
    this.stopPropagationElements.forEach(
      (el: MatIcon) => (el._elementRef.nativeElement.onclick = (event: PointerEvent): void => event.stopPropagation())
    );
  }

  public onBlock(): void {
    this.block.emit(this.chatRoom.parentId);
  }

  public onUnblock(): void {
    this.unblock.emit(this.chatRoom.parentId);
  }
}

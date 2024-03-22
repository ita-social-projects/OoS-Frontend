import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfoMenuType } from 'shared/enum/info-menu-type';

@Component({
  selector: 'app-info-menu',
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss']
})
export class InfoMenuComponent {
  @Input() public isBigIcon: boolean;
  @Input() public typeOfContent: InfoMenuType;

  @Output() public menuClosed = new EventEmitter<boolean>();

  public readonly InfoMenuType = InfoMenuType;
  public isOpened: boolean;

  constructor() {}

  public onMenuOpened(isOpened: boolean): void {
    this.isOpened = isOpened;
  }

  public onMenuClosed(isOpened: boolean): void {
    this.isOpened = isOpened;
    this.menuClosed.emit(isOpened);
  }
}

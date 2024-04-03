import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { InfoMenuType } from 'shared/enum/info-menu-type';

@Component({
  selector: 'app-info-menu',
  templateUrl: './info-menu.component.html',
  styleUrls: ['./info-menu.component.scss']
})
export class InfoMenuComponent implements AfterViewInit {
  @Input() public isBigIcon: boolean;
  @Input() public type: InfoMenuType = InfoMenuType.Text;
  @Input() public isOpenMenu: boolean;

  @Output() public menuClosed = new EventEmitter<boolean>();

  @ViewChild('trigger') public menuTrigger: MatMenuTrigger;

  public readonly InfoMenuType = InfoMenuType;
  public isOpened: boolean;

  constructor() {}

  public ngAfterViewInit(): void {
    if (this.isOpenMenu) {
      this.menuTrigger.openMenu();
    }
  }

  public onMenuOpened(isOpened: boolean): void {
    this.isOpened = isOpened;
  }

  public onMenuClosed(isOpened: boolean): void {
    this.isOpened = isOpened;
    this.menuClosed.emit(isOpened);
  }
}

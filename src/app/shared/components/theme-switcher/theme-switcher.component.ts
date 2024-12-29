import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { MessageBarType } from 'shared/enum/message-bar';
import { ShowMessageBar } from 'shared/store/app.actions';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {
  @Input()
  public isDark: boolean = false;
  @Output()
  public readonly themeSwitched = new EventEmitter<boolean>();

  constructor(
    private translate: TranslateService,
    private store: Store
  ) {}

  public onToggleChange({ checked }: MatSlideToggleChange): void {
    this.themeSwitched.emit(checked);
    const darkThemeMessage: string = this.translate.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.DARK_THEME_ON');
    const lightThemeMessage: string = this.translate.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.DARK_THEME_OFF');
    const message: string = checked ? darkThemeMessage : lightThemeMessage;
    this.showMessage(message, 'success', false);
  }

  private showMessage(message: string, type: MessageBarType, infinityDuration: boolean): void {
    this.store.dispatch(new ShowMessageBar({ message, type, infinityDuration }));
  }
}

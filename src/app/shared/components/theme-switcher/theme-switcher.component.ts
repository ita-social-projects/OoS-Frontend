import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { WINDOW } from 'ngx-window-token';
import { MessageBarType } from 'shared/enum/message-bar';
import { ShowMessageBar } from 'shared/store/app.actions';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  public isDark: boolean = false;

  constructor(
    private translate: TranslateService,
    private store: Store,
    private renderer: Renderer2,
    @Inject(WINDOW) private window: Window
  ) {}

  public ngOnInit(): void {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      this.isDark = savedTheme === 'dark';
    } else {
      this.isDark = this.window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.changeThemeClass(this.isDark);
  }

  public onToggleChange({ checked }: MatSlideToggleChange): void {
    this.isDark = checked;
    localStorage.setItem('preferred-theme', this.isDark ? 'dark' : 'light');

    this.changeThemeClass(this.isDark);

    // send message to user
    const darkThemeMessage: string = this.translate.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.DARK_THEME_ON');
    const lightThemeMessage: string = this.translate.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.DARK_THEME_OFF');
    const message: string = checked ? darkThemeMessage : lightThemeMessage;
    this.showMessage(message, 'success', false);
  }

  private changeThemeClass(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  private showMessage(message: string, type: MessageBarType, infinityDuration: boolean): void {
    this.store.dispatch(new ShowMessageBar({ message, type, infinityDuration }));
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CookiesPreferences } from '../../../models/cookies-preferences.model';

@Component({
  selector: 'app-cookie-preferences',
  templateUrl: './cookie-preferences.component.html',
  styleUrls: ['./cookie-preferences.component.scss']
})
export class CookiePreferencesComponent {
  @Input() private preferences: CookiesPreferences = {
    Essential: true,
    Analytics: false,
    Advertising: false
  };

  @Output() private readonly save = new EventEmitter<CookiesPreferences>();
  @Output() private readonly cancel = new EventEmitter<void>();

  public cookieOptions = [
    { key: 'Analytics', label: 'COOKIES.COOKIE_ANALYTICS_DESCRIPTION' },
    { key: 'Advertising', label: 'COOKIES.COOKIE_ADVERTISING_DESCRIPTION' }
  ];

  public onSave(): void {
    this.save.emit(this.preferences);
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onPreferenceChange(key: keyof typeof this.preferences, event: MatSlideToggleChange): void {
    this.preferences = { ...this.preferences, [key]: event.checked };
  }
}

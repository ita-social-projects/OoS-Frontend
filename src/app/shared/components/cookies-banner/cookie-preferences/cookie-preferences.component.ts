import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CookiesPreferences } from '../../../models/cookies-preferences.model';

@Component({
  selector: 'app-cookie-preferences',
  templateUrl: './cookie-preferences.component.html',
  styleUrls: ['./cookie-preferences.component.scss']
})
export class CookiePreferencesComponent {
  @Input() preferences: CookiesPreferences = {
    Essential: true,
    Analytics: false,
    Advertising: false
  };

  cookieOptions = [
    { key: 'Analytics', label: 'Cookies, які враховують ваші вподобання' },
    { key: 'Advertising', label: 'Cookies, які надають персоналізований контент' }
  ];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  onSave(): void {
    this.save.emit(this.preferences);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onPreferenceChange(key: keyof typeof this.preferences, event: MatSlideToggleChange): void {
    this.preferences[key] = event.checked;
  }
}

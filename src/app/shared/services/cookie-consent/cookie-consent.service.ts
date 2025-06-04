import { Injectable } from '@angular/core';
import { CookiesPreferences } from '../../models/cookies-preferences.model';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly consentKey = 'cookieConsent';
  private readonly preferencesKey = 'cookiePreferences';

  public getConsent(): boolean {
    return localStorage.getItem(this.consentKey) === 'true';
  }

  public setConsent(value: boolean): void {
    localStorage.setItem(this.consentKey, value.toString());
  }

  public getPreferences(): CookiesPreferences {
    const stored = localStorage.getItem(this.preferencesKey);
    return stored
      ? JSON.parse(stored)
      : {
          Essential: true,
          Analytics: false,
          Advertising: false
        };
  }

  public setPreferences(preferences: CookiesPreferences): void {
    localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
  }
}

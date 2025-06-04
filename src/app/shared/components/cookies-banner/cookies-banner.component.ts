import { Component, OnInit } from '@angular/core';
import { CookieConsentService } from '../../services/cookie-consent/cookie-consent.service';
import { CookiesPreferences } from '../../models/cookies-preferences.model';

@Component({
  selector: 'app-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  styleUrls: ['./cookies-banner.component.scss']
})
export class CookiesBannerComponent implements OnInit {
  consentGiven = false;
  showPreferences = false;

  preferences: CookiesPreferences = {
    Essential: true,
    Analytics: false,
    Advertising: false
  };

  constructor(private cookieService: CookieConsentService) {}

  public ngOnInit(): void {
    this.consentGiven = this.cookieService.getConsent();
    this.preferences = this.cookieService.getPreferences();
  }

  public acceptCookies(): void {
    this.cookieService.setConsent(true);
    this.preferences.Analytics = true;
    this.preferences.Advertising = true;
    this.cookieService.setPreferences(this.preferences);
    this.consentGiven = true;
  }

  public openPreferences(): void {
    this.showPreferences = true;
  }

  public closePreferences(): void {
    this.showPreferences = false;
  }

  public handlePreferencesSave(updatedPrefs: CookiesPreferences): void {
    this.cookieService.setPreferences(updatedPrefs);
    this.cookieService.setConsent(true);
    this.consentGiven = true;
    this.showPreferences = false;
  }
}

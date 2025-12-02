import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentService } from 'shared/services/cookie-consent/cookie-consent.service';
import { TranslateModule } from '@ngx-translate/core';
import { CookiesBannerComponent } from './cookies-banner.component';

describe('CookiesBannerComponent', () => {
  let component: CookiesBannerComponent;
  let fixture: ComponentFixture<CookiesBannerComponent>;
  let cookiesService: CookieConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookiesBannerComponent],
      providers: [{ provide: CookieConsentService }],
      imports: [TranslateModule.forRoot()]
    });
    cookiesService = TestBed.inject(CookieConsentService);
    fixture = TestBed.createComponent(CookiesBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('acceptCookies', () => {
    it('should enable all preferences, set consent, and update state', () => {
      jest.spyOn(cookiesService, 'setConsent');
      jest.spyOn(cookiesService, 'setPreferences');

      component.acceptCookies();

      expect(component.preferences.Analytics).toBeTruthy();
      expect(component.preferences.Advertising).toBeTruthy();
      expect(component.consentGiven).toBeTruthy();
      expect(cookiesService.setConsent).toHaveBeenCalledWith(true);
      expect(cookiesService.setPreferences).toHaveBeenCalledWith(component.preferences);
    });
  });

  describe('openPreferences', () => {
    it('should show preferences modal', () => {
      component.openPreferences();

      expect(component.showPreferences).toBeTruthy();
    });
  });

  describe('closePreferences', () => {
    it('should hide preferences modal', () => {
      component.closePreferences();

      expect(component.showPreferences).toBeFalsy();
    });
  });

  describe('handlePreferencesSave', () => {
    it('should save updated preferences and consent, hide preferences modal', () => {
      const newPrefs = {
        Essential: true,
        Analytics: true,
        Advertising: false
      };
      jest.spyOn(cookiesService, 'setConsent');
      jest.spyOn(cookiesService, 'setPreferences');

      component.handlePreferencesSave(newPrefs);

      expect(cookiesService.setPreferences).toHaveBeenCalledWith(newPrefs);
      expect(cookiesService.setConsent).toHaveBeenCalledWith(true);
      expect(component.consentGiven).toBeTruthy();
      expect(component.showPreferences).toBeFalsy();
    });
  });
});

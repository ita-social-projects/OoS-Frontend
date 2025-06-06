import { TestBed } from '@angular/core/testing';

import { CookieConsentService } from './cookie-consent.service';

describe('CookieConsentService', () => {
  let service: CookieConsentService;

  const mockPrefs = {
    Essential: true,
    Analytics: true,
    Advertising: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieConsentService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConsent', () => {
    it('should return true if consent is "true" in localStorage', () => {
      localStorage.setItem('cookieConsent', 'true');
      expect(service.getConsent()).toBeTruthy();
    });

    it('should return false if consent is not "true" in localStorage', () => {
      localStorage.setItem('cookieConsent', 'false');
      expect(service.getConsent()).toBeFalsy();
    });

    it('should return false if consent is not set', () => {
      expect(service.getConsent()).toBeFalsy();
    });
  });

  describe('setConsent', () => {
    it('should store boolean value as string in localStorage', () => {
      service.setConsent(true);
      expect(localStorage.getItem('cookieConsent')).toBe('true');

      service.setConsent(false);
      expect(localStorage.getItem('cookieConsent')).toBe('false');
    });
  });

  describe('getPreferences', () => {
    it('should return parsed preferences if stored in localStorage', () => {
      localStorage.setItem('cookiePreferences', JSON.stringify(mockPrefs));
      const prefs = service.getPreferences();
      expect(prefs).toEqual(mockPrefs);
    });

    it('should return default preferences if nothing is stored', () => {
      const prefs = service.getPreferences();
      expect(prefs).toEqual({
        Essential: true,
        Analytics: false,
        Advertising: false
      });
    });
  });

  describe('setPreferences', () => {
    it('should stringify and store preferences in localStorage', () => {
      service.setPreferences(mockPrefs);
      const stored = localStorage.getItem('cookiePreferences');
      expect(stored).toBe(JSON.stringify(mockPrefs));
    });
  });
});

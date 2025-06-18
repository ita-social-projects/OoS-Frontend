import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CookiePreferencesComponent } from './cookie-preferences.component';

describe('CookiePreferencesComponent', () => {
  let component: CookiePreferencesComponent;
  let fixture: ComponentFixture<CookiePreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookiePreferencesComponent],
      imports: [TranslateModule.forRoot()]
    });
    fixture = TestBed.createComponent(CookiePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save with current preferences', () => {
    const saveSpy = jest.spyOn(component.save, 'emit');

    component.preferences.Analytics = true;
    component.onSave();

    expect(saveSpy).toHaveBeenCalledWith(component.preferences);
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should update preferences on toggle change', () => {
    const changeEvent = { checked: true } as MatSlideToggleChange;
    component.preferences.Analytics = false;

    component.onPreferenceChange('Analytics', changeEvent);

    expect(component.preferences.Analytics).toBeTruthy();
  });

  it('should display the correct number of toggles', () => {
    const toggles = fixture.debugElement.queryAll(By.css('mat-slide-toggle'));
    expect(toggles.length).toBe(3);
  });
});

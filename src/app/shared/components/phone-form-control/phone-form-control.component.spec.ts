import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';

import { PhoneFormControlComponent } from './phone-form-control.component';

describe('PhoneFormControlComponent', () => {
  let component: PhoneFormControlComponent;
  let fixture: ComponentFixture<PhoneFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneFormControlComponent],
      imports: [NgxMatIntlTelInputComponent, MatFormFieldModule, ReactiveFormsModule, BrowserAnimationsModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneFormControlComponent);
    component = fixture.componentInstance;
    component.parentFormControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find country-search element on key press', fakeAsync(() => {
    jest.spyOn(component, 'handleKeyboardEvent');
    jest.spyOn(document, 'querySelector');
    jest.spyOn(global, 'setTimeout');

    document.dispatchEvent(new KeyboardEvent('keypress'));
    tick(200);

    expect(component.handleKeyboardEvent).toHaveBeenCalled();
    expect(document.querySelector).toHaveBeenCalledWith('.ngx-mat-tel-input-mat-menu-panel .country-search');
    expect(document.querySelector).toHaveReturned();
  }));

  it('should return country correctly when by code when called getCountry', () => {
    const code = 'ua';
    const expectedCountry: Country = {
      name: 'Ukraine (Україна)',
      iso2: 'ua',
      dialCode: '380',
      priority: 0,
      areaCodes: undefined,
      flagClass: 'UA',
      placeHolder: '+380501234567'
    };

    const result: Country = (component as any).inputComponent.getCountry(code);

    expect(result).toEqual(expectedCountry);
  });
});

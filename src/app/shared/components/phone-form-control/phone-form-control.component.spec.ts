import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { PhoneFormControlComponent } from './phone-form-control.component';

describe('PhoneFormControlComponent', () => {
  let component: PhoneFormControlComponent;
  let fixture: ComponentFixture<PhoneFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneFormControlComponent],
      imports: [NgxMatIntlTelInputComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

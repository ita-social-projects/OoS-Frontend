import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { PhoneFormControlComponent } from './phone-form-control.component';

describe('PhoneInputComponent', () => {
  let component: PhoneFormControlComponent;
  let fixture: ComponentFixture<PhoneFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneFormControlComponent],
      imports: [NgxMatIntlTelInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

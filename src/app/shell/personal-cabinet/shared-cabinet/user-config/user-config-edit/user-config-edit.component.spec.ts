import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { User } from 'shared/models/user.model';
import { UserConfigEditComponent } from './user-config-edit.component';

describe('UserConfigEditComponent', () => {
  let component: UserConfigEditComponent;
  let fixture: ComponentFixture<UserConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule,
        MatRadioModule,
        MatDatepickerModule,
        TranslateModule.forRoot()
      ],
      declarations: [UserConfigEditComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigEditComponent);
    component = fixture.componentInstance;
    component.user = {
      lastName: '',
      firstName: '',
      middleName: '',
      phoneNumber: '',
      gender: ''
    } as User;
    component.userEditFormGroup = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
  @Input() isPhoneNumber: boolean;
}

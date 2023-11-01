import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { KeyFilterDirective } from 'shared/directives/key-filter.directive';
import { CreateInfoFormComponent } from './create-info-form.component';

describe('CreateInfoFormComponent', () => {
  let component: CreateInfoFormComponent;
  let fixture: ComponentFixture<CreateInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatOptionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatInputModule,
        MatGridListModule,
        MatIconModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      declarations: [CreateInfoFormComponent, MockValidationHintForInputComponent, ImageFormControlComponent, KeyFilterDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
    component.infoFormGroup = new FormGroup({
      fullTitle: new FormControl(''),
      shortTitle: new FormControl(''),
      edrpouIpn: new FormControl(''),
      director: new FormControl(''),
      directorDateOfBirth: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      typeId: new FormControl(null),
      ownership: new FormControl(null),
      institution: new FormControl(''),
      institutionType: new FormControl(''),
      license: new FormControl(''),
      founder: new FormControl(''),
      institutionStatusId: new FormControl('')
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
  @Input() public validationFormControl: FormControl;
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public minMaxDate: boolean;
  @Input() public isTouched: boolean;
  @Input() public isPhoneNumber: boolean;
  @Input() public isEdrpouIpn: boolean;
}

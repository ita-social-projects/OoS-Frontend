import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { MinMaxDirective } from 'shared/directives/min-max.directive';
import { Workshop } from 'shared/models/workshop.model';
import { CreateAboutFormComponent } from './create-about-form.component';

describe('CreateAboutFormComponent', () => {
  let component: CreateAboutFormComponent;
  let fixture: ComponentFixture<CreateAboutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        MatInputModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatOptionModule,
        MatRadioModule,
        MatButtonToggleModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatGridListModule,
        NgxMatTimepickerModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        CreateAboutFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MinMaxDirective,
        MockWorkingHoursComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.AboutFormGroup = new FormGroup({
      coverImage: new FormControl(''),
      title: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      minAge: new FormControl(''),
      maxAge: new FormControl(''),
      image: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      price: new FormControl(''),
      workingHours: new FormControl(''),
      payRate: new FormControl(''),
      availableSeats: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-working-hours-form-wrapper',
  template: ''
})
class MockWorkingHoursComponent {
  @Input() workshop: Workshop;
  @Input() workingHoursFormArray: FormArray;
}

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl: FormControl; // required for validation
  @Input() isTouched: boolean;
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
  @Input() isPhoneNumber: boolean;
}

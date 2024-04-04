import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { MinMaxDirective } from 'shared/directives/min-max.directive';
import { Workshop } from 'shared/models/workshop.model';
import { InfoMenuType } from 'shared/enum/info-menu-type';
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
        MockWorkingHoursComponent,
        MockInfoMenuComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.workshop = {} as any;
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

  describe('getter minSeats', () => {
    it('should return minimumSeats when the taken seats in the workshop are equal to 0', () => {
      component.workshop.takenSeats = 0;

      expect(component.minSeats).toBe((component as any).minimumSeats);
    });

    it('should return the number of the taken seats in the workshop', () => {
      component.workshop.takenSeats = 7;

      expect(component.minSeats).toBe(7);
    });
  });

  describe('showHintAboutClosingWorkshop method', () => {
    it('should assign to isShowHint TRUE when availableSeats are equal to workshop takenSeats', () => {
      component.workshop.takenSeats = 7;

      component.showHintAboutClosingWorkshop();
      component.AboutFormGroup.controls.availableSeats.setValue(7);

      expect(component.isShowHint).toBe(true);
    });

    it('should assign to isShowHint FALSE when availableSeats are NOT equal to workshop takenSeats', () => {
      component.workshop.takenSeats = 7;

      component.showHintAboutClosingWorkshop();
      component.AboutFormGroup.controls.availableSeats.setValue(5);

      expect(component.isShowHint).toBe(false);
    });
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
  @Input() minNumberValue: boolean;
}

@Component({
  selector: 'app-info-menu',
  template: ''
})
class MockInfoMenuComponent {
  @Input() type: InfoMenuType;
  @Input() isOpenMenu: boolean;
}

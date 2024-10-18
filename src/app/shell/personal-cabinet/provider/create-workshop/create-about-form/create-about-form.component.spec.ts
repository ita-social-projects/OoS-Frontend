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
import { InfoMenuType } from 'shared/enum/info-menu-type';
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
      coverImageId: new FormControl(''),
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

    it('should return minimumSeats when the workshop is not provided', () => {
      component.workshop = null;

      expect(component.minSeats).toBe((component as any).minimumSeats);
    });
  });

  describe('showHintAboutClosingWorkshop method', () => {
    it('should assign to isShowHint TRUE when availableSeats are equal to workshop takenSeats', () => {
      component.workshop.takenSeats = 7;

      component.ngOnInit();
      component.AboutFormGroup.controls.availableSeats.setValue(7);

      expect(component.isShowHintAboutWorkshopAutoClosing).toBe(true);
    });

    it('should assign to isShowHint FALSE when availableSeats are NOT equal to workshop takenSeats', () => {
      component.workshop.takenSeats = 7;

      component.ngOnInit();
      component.AboutFormGroup.controls.availableSeats.setValue(5);

      expect(component.isShowHintAboutWorkshopAutoClosing).toBe(false);
    });
  });
  describe('activateEditMode', () => {
    it('should set competitiveSelectionDescription control if competitiveSelection is true', () => {
      component.workshop.competitiveSelection = true;
      component.workshop.competitiveSelectionDescription = 'Test Description';

      component.activateEditMode();

      expect(component.AboutFormGroup.contains('competitiveSelectionDescription')).toBeTruthy();
      expect(component.AboutFormGroup.get('competitiveSelectionDescription').value).toEqual('Test Description');
    });

    it('should not set competitiveSelectionDescription control if competitiveSelection is false', () => {
      component.workshop.competitiveSelection = false;

      component.activateEditMode();

      expect(component.AboutFormGroup.contains('competitiveSelectionDescription')).toBeFalsy();
    });
  });
  describe('removeCoverImageId', () => {
    it('should set coverImageId control to null create-about-form', () => {
      component.AboutFormGroup.controls.coverImageId.setValue('someId');
      expect(component.AboutFormGroup.controls.coverImageId.value).toBe('someId');

      const mockEvent = new Event('click');
      component.removeCoverImageId(mockEvent);

      expect(component.AboutFormGroup.controls.coverImageId.value).toBeNull();
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
  @Input() isOpenByDefault: boolean;
}

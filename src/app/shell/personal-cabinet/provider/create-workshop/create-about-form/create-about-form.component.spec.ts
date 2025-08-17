import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Provider } from 'shared/models/provider.model';

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
        NgxMaterialTimepickerModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        CreateAboutFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MinMaxDirective,
        MockWorkingHoursComponent,
        MockInfoMenuComponent,
        MockInstitutionHierarchyComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ param: 'someValue' }),
              params: {},
              data: {}
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.workshop = {} as any;
    component.AboutFormGroup = new FormGroup({
      useProviderInfoCtrl: new FormControl(false),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      title: new FormControl(''),
      shortTitle: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      noAgeRestrictions: new FormControl(false),
      minAge: new FormControl(''),
      maxAge: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(''),
      payRate: new FormControl(''),
      availableSeats: new FormControl(''),
      availableSeatsRadioBtnControl: new FormControl('')
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

  it('should disable age input fields if noAgeRestrictions is true', () => {
    component.AboutFormGroup.controls.noAgeRestrictions.setValue(true);

    expect(component.AboutFormGroup.controls.minAge.disabled).toBe(true);
    expect(component.AboutFormGroup.controls.maxAge.disabled).toBe(true);
    expect(component.AboutFormGroup.controls.minAge.value).toBe(null);
    expect(component.AboutFormGroup.controls.maxAge.value).toBe(null);
  });

  it('should enable age input fields if noAgeRestrictions is false', () => {
    component.AboutFormGroup.controls.noAgeRestrictions.setValue(false);

    expect(component.AboutFormGroup.controls.minAge.disabled).toBe(false);
    expect(component.AboutFormGroup.controls.maxAge.disabled).toBe(false);
    expect(component.AboutFormGroup.controls.minAge.touched).toBe(false);
    expect(component.AboutFormGroup.controls.maxAge.touched).toBe(false);
  });

  it('should set null value to age input fields if noAgeRestrictions is true', () => {
    component.workshop.noAgeRestrictions = true;
    component.workshop.minAge = 0;
    component.workshop.maxAge = 120;

    component.activateEditMode();

    expect(component.AboutFormGroup.controls.minAge.value).toBe(null);
    expect(component.AboutFormGroup.controls.maxAge.value).toBe(null);
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
  @Input() maxValue: boolean;
  @Input() minValue: boolean;
  @Input() isNumberValue: boolean;
}

@Component({
  selector: 'app-info-menu',
  template: ''
})
class MockInfoMenuComponent {
  @Input() type: InfoMenuType;
  @Input() isOpenByDefault: boolean;
}

@Component({
  selector: '<app-institution-hierarchy',
  template: ''
})
class MockInstitutionHierarchyComponent {
  @Input() institutionHierarchyIdFormControl: FormControl;
  @Input() institutionIdFormControl: FormControl;
  @Input() provider: Provider;
}

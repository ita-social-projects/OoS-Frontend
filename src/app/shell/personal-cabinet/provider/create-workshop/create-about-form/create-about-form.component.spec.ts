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
        NgxMatTimepickerModule,
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
      minAge: new FormControl(''),
      maxAge: new FormControl(''),
      competitiveSelection: new FormControl(''),
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

@Component({
  selector: '<app-institution-hierarchy',
  template: ''
})
class MockInstitutionHierarchyComponent {
  @Input() institutionHierarchyIdFormControl: FormControl;
  @Input() institutionIdFormControl: FormControl;
  @Input() provider: Provider;
}

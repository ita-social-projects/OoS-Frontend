import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CreateRequiredFormComponent } from './create-required-form.component';
import { ActivatedRoute } from '@angular/router';

describe('CreateRequiredFormComponent', () => {
  let component: CreateRequiredFormComponent;
  let fixture: ComponentFixture<CreateRequiredFormComponent>;

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
        CreateRequiredFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MinMaxDirective,
        MockInfoMenuComponent,
        MockInstitutionHierarchyComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequiredFormComponent);
    component = fixture.componentInstance;
    component.provider = {} as any;
    component.competition = {} as any;
    component.RequiredFormGroup = new FormGroup({
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
      numberOfSeats: new FormControl('')
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getter minSeats', () => {
    it('should return minimumSeats when the taken seats in the workshop are equal to 0', () => {
      component.competition.numberOfOccupiedSeats = 0;

      expect(component.minSeats).toBe((component as any).minimumSeats);
    });

    it('should return the number of the taken seats in the workshop', () => {
      component.competition.numberOfOccupiedSeats = 7;

      expect(component.minSeats).toBe(7);
    });

    it('should return minimumSeats when the workshop is not provided', () => {
      component.competition = null;

      expect(component.minSeats).toBe((component as any).minimumSeats);
    });
  });
});

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

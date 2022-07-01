import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAboutFormComponent } from './create-about-form.component';
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
import { ImageFormControlComponent } from '../../../../../shared/components/image-form-control/image-form-control.component';
import { MatSelectModule } from '@angular/material/select';
import { Provider } from 'src/app/shared/models/provider.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { MinMaxDirective } from 'src/app/shared/directives/min-max.directive';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Component, Input } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

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
        MatSelectModule,
        MatGridListModule,
        NgxMatTimepickerModule
      ],
      declarations: [
        CreateAboutFormComponent,
        ImageFormControlComponent,
        MockValidationHintAboutComponent,
        MinMaxDirective,
        MockWorkingHours
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAboutFormComponent);
    component = fixture.componentInstance;
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
      isPerMonth: new FormControl(''),
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
class MockWorkingHours {
  @Input() workshop: Workshop;
  @Input() workingHoursFormArray: FormArray;
}

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintAboutComponent {
  @Input() validationFormControl: FormControl; //required for validation
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isPhoneNumber: boolean;
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInfoFormComponent } from './create-info-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { KeyFilterDirective } from 'src/app/shared/directives/key-filter.directive';
import { NgxsModule } from '@ngxs/store';
import { ImageFormControlComponent } from 'src/app/shared/components/image-form-control/image-form-control.component';

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
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        CreateInfoFormComponent,
        MockValidationHintForInputComponent,
        ImageFormControlComponent,
        KeyFilterDirective
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
    component.InfoFormGroup = new FormGroup({
      fullTitle: new FormControl(''),
      shortTitle: new FormControl(''),
      edrpouIpn: new FormControl(''),
      director: new FormControl(''),
      directorDateOfBirth: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      type: new FormControl(null),
      ownership: new FormControl(null),
      institution: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
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
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
  @Input() isPhoneNumber: boolean;
}
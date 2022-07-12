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
        MockImageFormComponent,
        KeyFilterDirective
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
    component.InfoFormGroup = new FormGroup({
      coverImage: new FormControl(''),
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

@Component({
  selector: 'app-image-form-control',
  template: ''
})
class MockImageFormComponent {
  @Input() imgMaxAmount: number;
  @Input() coverImage: FormControl;
  @Input() imageIdsFormControl: FormControl;
  @Input() cropperConfig: object;
  @Input() label: string;
}

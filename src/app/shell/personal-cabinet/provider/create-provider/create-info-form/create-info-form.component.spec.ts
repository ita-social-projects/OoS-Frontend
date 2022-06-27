import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInfoFormComponent } from './create-info-form.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { KeyFilterDirective } from 'src/app/shared/directives/key-filter.directive';

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
      ],
      declarations: [
        CreateInfoFormComponent,
        MockValidationHintForInputComponent,
        KeyFilterDirective
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
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

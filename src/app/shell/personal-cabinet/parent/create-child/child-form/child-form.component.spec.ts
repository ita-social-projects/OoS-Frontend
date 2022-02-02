import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildFormComponent } from './child-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { Component, Input } from '@angular/core';

describe('ChildFormComponent', () => {
  let component: ChildFormComponent;
  let fixture: ComponentFixture<ChildFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        MatRadioModule,
        MatOptionModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatIconModule
      ],
      declarations: [
        ChildFormComponent,
        MockValidationHintForInputComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildFormComponent);
    component = fixture.componentInstance;
    component.ChildFormGroup = new FormGroup({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      dateOfBirth: new FormControl(''),
      gender: new FormControl(''),
      socialGroupId: new FormControl(''),
      placeOfStudy: new FormControl(''),
      placeOfLiving: new FormControl(''),
      certificateOfBirth: new FormControl('')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint-for-input',
  template: ''
})

class MockValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() isEmailCheck: boolean;
  @Input() isEmptyCheck: boolean;
  @Input() minLength: boolean;
  @Input() minCharachters: number; 
  @Input() forbiddenCharacter: string;
}

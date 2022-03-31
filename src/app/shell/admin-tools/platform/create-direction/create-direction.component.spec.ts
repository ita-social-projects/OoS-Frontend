import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { CreateDirectionComponent } from './create-direction.component';

describe('CreateDirectionComponent', () => {
  let component: CreateDirectionComponent;
  let fixture: ComponentFixture<CreateDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatStepperModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CreateDirectionComponent,
        MockValidationHintForInputComponent,
        MockAddDepartmentFormComponent,
        MockAddDirectionFormComponent,
        MockAddClassFormComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectionComponent);
    component = fixture.componentInstance;
    component.directionFormGroup = new FormGroup({
      image: new FormControl(''),
      directionName: new FormControl('', [Validators.required]),
      sectionName: new FormControl('', [Validators.required]),
      className: new FormControl('', [Validators.required]),
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
  @Input() isEmptyCheck: boolean;
  @Input() forbiddenCharacter: string;
  @Input() directionFormGroup: FormGroup;
  @Input() classFormGroup: FormGroup;
  @Input() departmentFormGroup: FormGroup;
}
@Component({
  selector: 'app-add-direction-form',
  template: ''
})
class MockAddDirectionFormComponent {
}

@Component({
  selector: 'app-add-department-form',
  template: ''
})
class MockAddDepartmentFormComponent {
}

@Component({
  selector: 'app-add-class-form',
  template: ''
})
class MockAddClassFormComponent {
}

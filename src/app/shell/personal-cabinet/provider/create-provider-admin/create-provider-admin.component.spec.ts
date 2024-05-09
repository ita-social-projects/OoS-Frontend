import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { Workshop } from 'shared/models/workshop.model';
import { CreateProviderAdminComponent } from './create-provider-admin.component';

describe('CreateProviderAdminComponent', () => {
  let component: CreateProviderAdminComponent;
  let fixture: ComponentFixture<CreateProviderAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      declarations: [CreateProviderAdminComponent, MockValidationHintForInputComponent, MockWorkshopChekcboxDropdownComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderAdminComponent);
    component = fixture.componentInstance;
    component.ProviderAdminFormGroup = new FormGroup({
      lastName: new FormControl(''),
      middleName: new FormControl(''),
      firstName: new FormControl(''),
      phoneNumber: new FormControl(),
      email: new FormControl()
    });
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
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() isPhoneNumber: true;
}

@Component({
  selector: 'app-entity-checkbox-dropdown',
  template: ''
})
class MockWorkshopChekcboxDropdownComponent {
  @Input() entities: Workshop[];
  @Input() dropdownContainerClass: string;
  @Input() declination: string;
}

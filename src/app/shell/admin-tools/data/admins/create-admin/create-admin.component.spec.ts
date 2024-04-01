import { CommonModule } from '@angular/common';
import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State } from '@ngxs/store';

import { AdminStateModel } from 'shared/store/admin.state';
import { CreateAdminComponent } from './create-admin.component';

describe('CreateAdminComponent', () => {
  let component: CreateAdminComponent;
  let fixture: ComponentFixture<CreateAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockAdminState]),
        MatStepperModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        CommonModule,
        FormsModule,
        MatSelectModule,
        TranslateModule.forRoot()
      ],
      declarations: [MockValidationHintForInputComponent, CreateAdminComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ param: 'areaAdmin', id: 'id' }) } } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should return correct institution form control', () => {
      expect(component.institutionFormControl).toEqual(component.adminFormGroup.get('institution'));
    });

    it('should return correct region form control', () => {
      expect(component.regionFormControl).toEqual(component.adminFormGroup.get('region'));
    });

    it('should return correct territorial community form control', () => {
      expect(component.territorialCommunityFormControl).toEqual(component.adminFormGroup.get('territorialCommunity'));
    });
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
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
  @Input() isPhoneNumber: boolean;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    selectedAdmin: {}
  } as AdminStateModel
})
@Injectable()
class MockAdminState {}

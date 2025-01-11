import { CommonModule } from '@angular/common';
import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State } from '@ngxs/store';

import { AdminRoles } from 'shared/enum/admins';
import { Codeficator } from 'shared/models/codeficator.model';
import { Institution } from 'shared/models/institution.model';
import { AdminStateModel } from 'shared/store/admin.state';
import { CreateAdminComponent } from './create-admin.component';

describe('CreateAdminComponent', () => {
  let component: CreateAdminComponent;
  let fixture: ComponentFixture<CreateAdminComponent>;
  const adminRole = AdminRoles.areaAdmin;

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
      declarations: [MockValidationHintForInputComponent, CreateAdminComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: { paramMap: convertToParamMap({ param: adminRole, id: 'id' }) } } });
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

  describe('compare methods', () => {
    it('should return TRUE if comparing institutions with same id', () => {
      const institution1 = { id: 'institutionId1' } as Institution;
      const institution2 = { id: 'institutionId1' } as Institution;

      expect(component.compareInstitutions(institution1, institution2)).toBeTruthy();
    });

    it('should return FALSE if comparing institutions with different id', () => {
      const institution1 = { id: 'institutionId1' } as Institution;
      const institution2 = { id: 'institutionId2' } as Institution;

      expect(component.compareInstitutions(institution1, institution2)).toBeFalsy();
    });

    it('should return TRUE if comparing codeficators with same id', () => {
      const codeficator1 = { id: 1 } as Codeficator;
      const codeficator2 = { id: 1 } as Codeficator;

      expect(component.compareCodeficators(codeficator1, codeficator2)).toBeTruthy();
    });

    it('should return FALSE if comparing codeficators with different id', () => {
      const codeficator1 = { id: 1 } as Codeficator;
      const codeficator2 = { id: 2 } as Codeficator;

      expect(component.compareCodeficators(codeficator1, codeficator2)).toBeFalsy();
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

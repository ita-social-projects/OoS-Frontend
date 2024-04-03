import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation, CompanyInformationSectionItem } from 'shared/models/company-information.model';
import { UpdatePlatformInfo } from 'shared/store/admin.actions';
import { AdminStateModel } from 'shared/store/admin.state';
import { InfoEditComponent } from './info-edit.component';

describe('PlatformInfoEditComponent', () => {
  let component: InfoEditComponent;
  let fixture: ComponentFixture<InfoEditComponent>;
  let store: Store;
  let router: Router;
  let adminTabType = AdminTabTypes.AboutPortal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockAdminState]),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [InfoEditComponent, MockInfoFormComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { params: of({ param: adminTabType, mode: 'edit' }) } });
    fixture = TestBed.createComponent(InfoEditComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('platformInfo property', () => {
    let counter = 0;

    beforeEach(() => {
      adminTabType = Object.values(AdminTabTypes)[++counter];
    });

    it('should set AboutPortal as platformInfo according to param tab type', () => {
      expect(component.platformInfo).toEqual(mockAboutPortal);
    });

    it('should set MainPageInformation as platformInfo according to param tab type', () => {
      expect(component.platformInfo).toEqual(mockMainPageInformation);
    });

    it('should set LawsAndRegulations as platformInfo according to param tab type', () => {
      expect(component.platformInfo).toEqual(mockLawsAndRegulations);
    });

    it('should set SupportInformation as platformInfo according to param tab type', () => {
      expect(component.platformInfo).toEqual(mockSupportInformation);
    });

    it('should add new form to array if params are missing', () => {
      const initialLength = component.platformInfoItemFormArray.length;
      jest.spyOn(component, 'setEditMode');
      jest.spyOn(component, 'onAddForm');

      (component as any).setInitialData({});

      expect(component.setEditMode).not.toHaveBeenCalled();
      expect(component.onAddForm).toHaveBeenCalled();
      expect(component.platformInfoItemFormArray.length).toEqual(initialLength + 1);
    });
  });

  describe('platformInfoItemFormArray property', () => {
    it('should add a new form to the form array', () => {
      const initialLength = component.platformInfoItemFormArray.length;

      component.onAddForm();

      expect(component.platformInfoItemFormArray.length).toEqual(initialLength + 1);
    });

    it('should remove a form from the form array at the given index', () => {
      component.onAddForm();

      const initialLength = component.platformInfoItemFormArray.length;
      const indexToRemove = 0;

      component.onDeleteForm(indexToRemove);

      expect(component.platformInfoItemFormArray.length).toEqual(initialLength - 1);
    });
  });

  it('should navigate to /admin-tools/platform when onCancel is called', () => {
    jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin-tools/platform']);
  });

  describe('onSubmit method', () => {
    beforeEach(() => {
      component.onAddForm();
      component.platformInfo = { id: 'id' } as CompanyInformation;
      component.platformInfoEditFormGroup.get('sectionName').setValue('SectionName', { emitEvent: false });
      component.platformInfoEditFormGroup.get('description').setValue('Description', { emitEvent: false });
      component.titleFormControl.setValue('Title', { emitEvent: false });
      jest.spyOn((component as any).dispatchSubject, 'next');
    });

    it('should update platform info in store when onSubmit is called with valid form data', () => {
      const expectedPlatformInfoItemArray: CompanyInformationSectionItem[] = [];
      component.platformInfoItemFormArray.controls.forEach((form: FormGroup) =>
        expectedPlatformInfoItemArray.push(new CompanyInformationSectionItem(form.value))
      );
      jest.spyOn(store, 'dispatch');

      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        new UpdatePlatformInfo(
          new CompanyInformation(component.titleFormControl.value, expectedPlatformInfoItemArray, component.platformInfo.id),
          component.platformInfoType
        )
      );
    });

    it('should trigger dispatch subject when onSubmit is called with valid form data', () => {
      component.onSubmit();

      expect((component as any).dispatchSubject.next).toHaveBeenCalled();
    });

    it('should not trigger dispatch subject when onSubmit is called with invalid form data', () => {
      component.titleFormControl.setErrors({ error: true });

      component.onSubmit();

      expect((component as any).dispatchSubject.next).not.toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'app-info-form',
  template: ''
})
class MockInfoFormComponent {
  @Input() index: number;
  @Input() formAmount: number;
  @Input() infoEditFormGroup: FormGroup;
  @Input() maxDescriptionLength: number;
}

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
}

const mockAboutPortal = { companyInformationItems: [{ sectionName: 'AboutPortal' }] } as CompanyInformation;
const mockMainPageInformation = { companyInformationItems: [{ sectionName: 'MainPageInformation' }] } as CompanyInformation;
const mockSupportInformation = { companyInformationItems: [{ sectionName: 'SupportInformation' }] } as CompanyInformation;
const mockLawsAndRegulations = { companyInformationItems: [{ sectionName: 'LawsAndRegulations' }] } as CompanyInformation;

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: mockAboutPortal,
    mainPageInformation: mockMainPageInformation,
    supportInformation: mockSupportInformation,
    lawsAndRegulations: mockLawsAndRegulations
  } as AdminStateModel
})
@Injectable()
class MockAdminState {}

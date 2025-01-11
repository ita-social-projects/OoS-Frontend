import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyNativeDateModule as MatNativeDateModule, MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { ValidationConstants } from 'shared/constants/validation';
import { KeyFilterDirective } from 'shared/directives/key-filter.directive';
import { InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { ProviderStatuses } from 'shared/enum/statuses';
import { Institution } from 'shared/models/institution.model';
import { Provider } from 'shared/models/provider.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { GetAllInstitutions, GetInstitutionStatuses, GetProviderTypes } from 'shared/store/meta-data.actions';
import { MetaDataStateModel } from 'shared/store/meta-data.state';
import { CreateInfoFormComponent } from './create-info-form.component';

describe('CreateInfoFormComponent', () => {
  let component: CreateInfoFormComponent;
  let fixture: ComponentFixture<CreateInfoFormComponent>;
  let store: Store;

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
        MatGridListModule,
        MatIconModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([MockMetaDataState]),
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      declarations: [CreateInfoFormComponent, MockValidationHintForInputComponent, ImageFormControlComponent, KeyFilterDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters', () => {
    it('should return correct ownership type control', () => {
      expect(component.ownershipTypeControl).toEqual(component.infoFormGroup.get('ownership'));
    });

    it('should return correct edrpou/ipn type control', () => {
      expect(component.edrpouIpnTypeControl).toEqual(component.infoFormGroup.get('edrpouIpn'));
    });

    it('should return correct edrpou/ipn label', () => {
      component.infoFormGroup.get('ownership').setValue(OwnershipTypes.State);
      expect(component.edrpouIpnLabel).toEqual('FORMS.LABELS.EDRPO');

      component.infoFormGroup.get('ownership').setValue(OwnershipTypes.Common);
      expect(component.edrpouIpnLabel).toEqual('FORMS.LABELS.IPN');
    });

    it('should return correct edrpou/ipn length', () => {
      component.infoFormGroup.get('ownership').setValue(OwnershipTypes.State);
      expect(component.edrpouIpnLength).toEqual(ValidationConstants.EDRPOU_LENGTH);

      component.infoFormGroup.get('ownership').setValue(OwnershipTypes.Common);
      expect(component.edrpouIpnLength).toEqual(ValidationConstants.IPN_LENGTH);
    });
  });

  describe('ownershipTypeControl valueChanges subscription', () => {
    const mockEdrpouIpn = '123456789012345678901234567890123';

    it('should update edrpouIpnTypeControl value if ownership type is state', () => {
      component.ngOnInit();
      component.edrpouIpnTypeControl.setValue(mockEdrpouIpn, { emitEvent: false });
      jest.spyOn(component.edrpouIpnTypeControl, 'setValue');

      component.ownershipTypeControl.setValue(OwnershipTypes.State);

      expect(component.edrpouIpnTypeControl.setValue).toHaveBeenCalled();
      expect(component.edrpouIpnTypeControl.value).toEqual(mockEdrpouIpn.substring(0, ValidationConstants.EDRPOU_LENGTH));
    });

    it('should not update edrpouIpnTypeControl value if ownership type is not state', () => {
      component.ngOnInit();
      component.edrpouIpnTypeControl.setValue(mockEdrpouIpn, { emitEvent: false });
      jest.spyOn(component.edrpouIpnTypeControl, 'setValue');

      component.ownershipTypeControl.setValue(OwnershipTypes.Common);

      expect(component.edrpouIpnTypeControl.setValue).not.toHaveBeenCalled();
    });
  });

  describe('compareInstitutions', () => {
    let institution1: Institution;
    let institution2: Institution;

    beforeEach(() => {
      institution1 = { id: '1', title: 'Institution 1', numberOfHierarchyLevels: 0 };
      institution2 = { id: '1', title: 'Institution 1', numberOfHierarchyLevels: 0 };
    });

    it('should return true if institutions have the same id', () => {
      const result = component.compareInstitutions(institution1, institution2);

      expect(result).toBeTruthy();
    });

    it('should return false if institutions have different ids', () => {
      institution2.id = '2';

      const result = component.compareInstitutions(institution1, institution2);

      expect(result).toBeFalsy();
    });
  });

  describe('initData', () => {
    let mockProvider: Provider;

    beforeEach(() => {
      mockProvider = {
        ownership: OwnershipTypes.State,
        fullTitle: '',
        shortTitle: '',
        email: '',
        edrpouIpn: '',
        director: '',
        directorDateOfBirth: '',
        phoneNumber: '',
        founder: '',
        status: ProviderStatuses.Approved,
        userId: '',
        legalAddress: null,
        institution: null,
        institutionType: InstitutionTypes.Complex,
        providerSectionItems: [],
        coverImage: null,
        coverImageId: ''
      };
    });

    it('should initialize institution statuses', () => {
      jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith([new GetAllInstitutions(true), new GetProviderTypes(), new GetInstitutionStatuses()]);
      expect(component.infoFormGroup.get('institutionStatusId').value).toEqual(mockInstitutionStatuses[0].id);
    });

    it('should activate edit mode if provider is provided', () => {
      component.provider = mockProvider;
      jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(new ActivateEditMode(true));
    });
  });
});

const mockInstitutionStatuses = [
  { id: 1, name: 'Status 1' },
  { id: 2, name: 'Status 2' }
];

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() public validationFormControl: FormControl;
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public minMaxDate: boolean;
  @Input() public isTouched: boolean;
  @Input() public isPhoneNumber: boolean;
  @Input() public isEdrpouIpn: boolean;
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    socialGroups: [],
    institutionStatuses: mockInstitutionStatuses,
    providerTypes: [],
    achievementsTypes: [],
    rating: undefined,
    isLoading: false,
    featuresList: undefined,
    institutions: [],
    institutionFieldDesc: [],
    instituitionsHierarchyAll: [],
    instituitionsHierarchy: [],
    editInstituitionsHierarchy: [],
    codeficatorSearch: [],
    codeficator: undefined
  }
})
@Injectable()
class MockMetaDataState {}

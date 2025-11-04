import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { Provider } from 'shared/models/provider.model';
import { InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { Institution } from 'shared/models/institution.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Competition } from 'shared/models/competition.model';
import { WorkshopType } from 'shared/enum/workshop';
import * as ProviderUtil from 'shared/utils/provider.utils';
import { shouldBeDraft } from 'shared/utils/provider.utils';
import { RegistrationState } from 'shared/store/registration.state';
import { ModeConstants } from 'shared/constants/constants';
import { CreateCompetitionComponent } from './create-competition.component';

describe('CreateCompetitionComponent', () => {
  let component: CreateCompetitionComponent;
  let fixture: ComponentFixture<CreateCompetitionComponent>;
  let router: Router;
  let store: Store;
  let navigationBarService: NavigationBarService;
  let activatedRoute: ActivatedRoute;

  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      afterClosed: () => of(true)
    })
  };

  const mockStore = {
    dispatch: jest.fn(),
    select: jest.fn().mockImplementation((selector) => {
      if (selector === RegistrationState.provider) {
        return of(provider);
      }
      return of(null);
    }),
    selectSnapshot: jest.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: new Map([
        ['id', '1'],
        ['entity', WorkshopType.Competition],
        ['param', '123']
      ])
    }
  };

  const navigationBarServiceMock = {
    createNavPaths: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  const sampleInstitution: Institution = {
    id: 'institution-id',
    title: 'main',
    numberOfHierarchyLevels: 10
  };

  const required = {
    id: '1',
    title: 'Competition Title',
    shortTitle: 'Short Title',
    competitionDateRangeGroup: {
      start: new Date('2025-01-01T00:00:00'),
      end: new Date('2025-01-02T00:00:00')
    },
    competitiveEventAccountingTypeId: 1,
    numberOfSeats: 100,
    judges: [],
    registrationDateRangeGroup: {
      start: new Date('2025-01-01T00:00:00'),
      end: new Date('2025-01-02T00:00:00')
    },
    parentCompetition: '',
    minimumAge: 18,
    maximumAge: 40,
    phone: '+380954356565',
    email: 'test@gmail.com'
  };

  const provider: Provider = {
    id: '123',
    ownership: OwnershipTypes.Common,
    isBlocked: false,
    fullTitle: 'Sample Provider',
    shortTitle: 'SP',
    edrpou: '12345678',
    status: ProviderStatuses.Approved,
    licenseStatus: LicenseStatuses.Approved,
    userId: 'user-id',
    institution: sampleInstitution,
    institutionType: InstitutionTypes.Other,
    providerSectionItems: []
  } as unknown as Provider;

  mockStore.selectSnapshot.mockReturnValue(of(provider));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCompetitionComponent],
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NavigationBarService, useValue: navigationBarServiceMock },
        { provide: MatDialog, useValue: matDialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCompetitionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    navigationBarService = TestBed.inject(NavigationBarService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    component.RequiredFormGroup = new FormGroup({
      title: new FormControl(required.title),
      shortTitle: new FormControl(required.shortTitle),
      competitionDateRangeGroup: new FormGroup({
        start: new FormControl(required.competitionDateRangeGroup.start),
        end: new FormControl(required.competitionDateRangeGroup.end)
      }),
      minimumAge: new FormControl(required.minimumAge),
      maximumAge: new FormControl(required.maximumAge),
      registrationDateRangeGroup: new FormGroup({
        start: new FormControl(required.registrationDateRangeGroup.start),
        end: new FormControl(required.registrationDateRangeGroup.end)
      }),
      competitiveEventAccountingTypeId: new FormControl(required.competitiveEventAccountingTypeId),
      parentCompetitionControl: new FormControl(required.parentCompetition),
      numberOfSeats: new FormControl(required.numberOfSeats)
    });
    component.DescriptionFormGroup = new FormGroup({
      subDirectionIds: new FormControl([
        { id: 1, title: 'sub1' },
        { id: 2, title: 'sub2' }
      ])
    });
    component.JudgeFormArray = new FormArray([]);
    component.ContactsFormArray = new FormArray([]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set params', () => {
    fixture.detectChanges();
    expect((component as any).entity).toBeTruthy();
    expect((component as any).param).toBeTruthy();
    expect((component as any).parentCompetition).toBeTruthy();
  });

  it('should navigate to competitions list on cancel', () => {
    const cancelSpy = jest.spyOn(router, 'navigate');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalledWith(['/personal-cabinet/provider/competitions']);
  });

  describe('pre-submit methods', () => {
    it('should create description correctly', () => {
      component.DescriptionFormGroup = new FormGroup({
        subDirectionIds: new FormControl([
          { id: 1, title: 'Sub1' },
          { id: 2, title: 'Sub2' }
        ])
      });

      const description = (component as any).createDescription();

      expect(description.subDirectionIds).toEqual([1, 2]);
    });
  });

  describe('shouldBeDraft', () => {
    let anotherCompetition: Competition;

    beforeEach(() => {
      component.competition = {
        title: 'Title',
        shortTitle: 'Short',
        coverImage: new File([''], 'filename.jpg', { type: 'image/jpeg' }),
        imageFiles: [new File([''], 'filename1.jpg', { type: 'image/jpeg' }), new File([''], 'filename2.jpg', { type: 'image/jpeg' })],
        descriptionOfTheEnrollmentProcedure: 'desc',
        competitiveEventDescriptionItems: [
          { sectionName: 'hel2', description: 'hel2' },
          { sectionName: 'hel2', description: 'hel2' }
        ],
        additionalDescription: 'addesc',
        description: 'desc',
        subDirectionIds: [1, 2],
        preferentialTermsOfParticipation: 'terms'
      } as Competition;

      anotherCompetition = {
        title: 'Title',
        shortTitle: 'Short',
        coverImage: new File([''], 'filename.jpg', { type: 'image/jpeg' }),
        imageFiles: [new File([''], 'filename1.jpg', { type: 'image/jpeg' }), new File([''], 'filename2.jpg', { type: 'image/jpeg' })],
        descriptionOfTheEnrollmentProcedure: 'desc',
        competitiveEventDescriptionItems: [
          { sectionName: 'hel2', description: 'hel2' },
          { sectionName: 'hel2', description: 'hel2' }
        ],
        additionalDescription: 'addesc',
        description: 'desc',
        subDirectionIds: [1, 2],
        preferentialTermsOfParticipation: 'terms'
      } as Competition;

      jest.clearAllMocks();
    });

    it('should NOT be draft', () => {
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(false);
    });

    it('should be draft if primitives changed', () => {
      anotherCompetition.title = 'Another Title';

      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);
    });

    it('should be draft if coverImage changed', () => {
      anotherCompetition.coverImage = new File([''], 'filename1.jpg', { type: 'image/png' });
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);

      anotherCompetition.coverImage = null;
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);
    });

    it('should be draft if files changed', () => {
      anotherCompetition.imageFiles = [
        new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename3.jpg', { type: 'image/jpeg' })
      ];
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);

      anotherCompetition.imageFiles = [
        new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename2.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename3.jpg', { type: 'image/jpeg' })
      ];
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);
    });

    it('should be draft if additional description changed', () => {
      anotherCompetition.additionalDescription = 'test';
      expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);
    });

    describe('should be draft if competitiveEventDescriptionItems changed', () => {
      afterEach(() => {
        expect(shouldBeDraft(component.competition, anotherCompetition, (component as any).fieldsToCheck)).toBe(true);
      });

      it('length changed', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: 'hel2', description: 'hel2' },
          { sectionName: 'hel2', description: 'hel2' },
          { sectionName: 'hel3', description: 'hel3' }
        ];
      });

      it('sectionName changed', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: 'hel1', description: 'hel2' },
          { sectionName: 'hel2', description: 'hel2' }
        ];
      });

      it('description changed', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: 'hel2', description: 'hel3' },
          { sectionName: 'hel2', description: 'hel2' }
        ];
      });

      it('structure changed', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: 'hel2', description: 'hel3', competitiveEventId: '123' },
          { sectionName: 'hel2', description: 'hel2' }
        ];
      });

      it('partially null', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: null, description: 'hel3' },
          { sectionName: 'hel2', description: 'hel2' }
        ];
      });

      it('partially undefined', () => {
        anotherCompetition.competitiveEventDescriptionItems = [
          { sectionName: undefined, description: 'hel3' },
          { sectionName: 'hel2', description: 'hel2' }
        ];
      });

      it('fully null', () => {
        anotherCompetition.competitiveEventDescriptionItems = [null, { sectionName: 'hel2', description: 'hel2' }];
      });

      it('fully undefined', () => {
        anotherCompetition.competitiveEventDescriptionItems = [undefined, null];
      });
    });

    it('should be draft matDialog', () => {
      jest.spyOn(ProviderUtil, 'shouldBeDraft').mockReturnValue(true);

      component.editMode = true;

      component.onSubmit();

      expect(matDialogMock.open).toHaveBeenCalledWith(
        ConfirmationModalWindowComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            type: ModalConfirmationType.draftEditSet
          })
        })
      );
    });

    it('should NOT be draft matDialog', () => {
      jest.spyOn(ProviderUtil, 'shouldBeDraft').mockReturnValue(false);

      component.editMode = true;

      component.onSubmit();

      expect(matDialogMock.open).not.toHaveBeenCalled();
    });
  });

  describe('IsAllFormsNotDirtyAndInvalid', () => {
    it('should return true, if all forms are not dirty', () => {
      component.RequiredFormGroup.markAsPristine();
      component.DescriptionFormGroup.markAsPristine();
      component.ContactsFormArray.markAsPristine();

      expect(component.IsAllFormsNotDirtyAndInvalid).toBe(true);
    });

    it('should return true, if at least one form is invalid', () => {
      component.RequiredFormGroup.setErrors({ required: true });
      expect(component.IsAllFormsNotDirtyAndInvalid).toBe(true);
    });

    it('should return false, if all valid and dirty', () => {
      component.RequiredFormGroup.markAsDirty();
      component.DescriptionFormGroup.markAsDirty();
      component.ContactsFormArray.markAsDirty();

      expect(component.IsAllFormsNotDirtyAndInvalid).toBe(false);
    });
  });

  describe('isUnfinished', () => {
    it('should return true, if param === UNFINISHED', () => {
      activatedRouteMock.snapshot.paramMap.get = jest.fn().mockReturnValue(ModeConstants.UNFINISHED);
      expect(component.isUnfinished).toBe(true);
    });

    it('should return false, if param is not UNFINISHED', () => {
      activatedRouteMock.snapshot.paramMap.get = jest.fn().mockReturnValue('OTHER');
      expect(component.isUnfinished).toBe(false);
    });
  });
});

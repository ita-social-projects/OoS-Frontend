import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { Provider } from 'shared/models/provider.model';
import { InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { Institution } from 'shared/models/institution.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Competition, UnfinishedCompetitionRequired, UnfinishedCompetitionType } from 'shared/models/competition.model';
import { WorkshopType } from 'shared/enum/workshop';
import * as ProviderUtils from 'shared/utils/provider.utils';
import { shouldBeDraft } from 'shared/utils/provider.utils';
import { RegistrationState } from 'shared/store/registration.state';
import { GetUnfinishedCompetition, OnSaveWorkshopStep } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
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
      if (selector === ProviderState.unfinishedCompetition) {
        return of({ provider: { competitionDraft: mockCompetition } });
      }
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

  const mockCompetition: UnfinishedCompetitionRequired = {
    competitionDateRangeGroup: { end: undefined, start: undefined },
    competitiveEventAccountingTypeId: 0,
    email: '',
    maximumAge: 0,
    minimumAge: 0,
    phone: '',
    title: 'fkfkkff',
    shortTitle: 'fghjhgf',
    numberOfSeats: 4294967295,
    base64CoverImage: 'image',
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    $type: UnfinishedCompetitionType.WithAboutProperties
  };

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
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
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

  it('should return first invalid step index', () => {
    component.RequiredFormGroup.get('title')?.setErrors({ required: true });
    expect((component as any).getFirstInvalidStep()).toBe(0);
  });

  it('should dispatch GetUnfinishedCompetition and set competition data', (done) => {
    component.loadUnfinishedCompetitionData();

    expect(store.dispatch).toHaveBeenCalledWith(new GetUnfinishedCompetition());
    (component as any).unfinishedCompetition$.subscribe((draft) => {
      expect(draft).toEqual({ provider: { competitionDraft: mockCompetition } });
      done();
    });
  });

  it('should not change stepper index if no invalid steps are found', () => {
    component.stepper = { selectedIndex: 0 } as any;
    jest.spyOn(component as any, 'getFirstInvalidStep').mockReturnValue(-1);

    component.loadUnfinishedCompetitionData();
    expect(component.stepper.selectedIndex).toBe(0);
  });

  it('should return if form is invalid', () => {
    const form = new FormGroup({
      mock: new FormControl(null)
    });
    form.setErrors({ invalid: true });
    const routeSpy = jest.spyOn(activatedRouteMock.snapshot.paramMap, 'get');
    component.saveUnfinishedData(form);
    expect(routeSpy).not.toHaveBeenCalled();
  });

  it('should dispatch unfinished data correctly', () => {
    const step = 2;
    const extraData = { description: 'Test Description' };
    (component as any).dispatchUnfinishedData(step, extraData);

    expect(store.dispatch).toHaveBeenCalledWith(new OnSaveWorkshopStep({ data: expect.any(Object), step }));
  });

  it('should execute stepActions correctly', () => {
    const step = 1;
    const mockData = { test: 'value' };
    jest.spyOn(component as any, 'createStepData').mockReturnValue(of(mockData));
    jest.spyOn(component as any, 'dispatchUnfinishedData');

    (component as any).stepActions[step]();

    expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(step, mockData);
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
      } as unknown as Competition;

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
      } as unknown as Competition;

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
      jest.spyOn(ProviderUtils, 'shouldBeDraft').mockReturnValue(true);

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
      jest.spyOn(ProviderUtils, 'shouldBeDraft').mockReturnValue(false);

      component.editMode = true;

      component.onSubmit();

      expect(matDialogMock.open).not.toHaveBeenCalled();
    });
  });

  describe('stepActions', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'createStepData').mockReturnValue(of({ mockData: 'test' }));
      jest.spyOn(component as any, 'dispatchUnfinishedData');
    });

    it('should execute step 1 action correctly', (done) => {
      (component as any).stepActions[1]();

      setTimeout(() => {
        expect((component as any).createStepData).toHaveBeenCalledWith(1);
        expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(1, { mockData: 'test' });
        done();
      }, 0);
    });

    it('should execute step 2 action correctly', (done) => {
      (component as any).stepActions[2]();

      setTimeout(() => {
        expect((component as any).createStepData).toHaveBeenCalledWith(2);
        expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(2, { mockData: 'test' });
        done();
      }, 0);
    });

    it('should execute step 3 action correctly', (done) => {
      (component as any).stepActions[3]();

      setTimeout(() => {
        expect((component as any).createStepData).toHaveBeenCalledWith(3);
        expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(3, { mockData: 'test' });
        done();
      }, 0);
    });
  });

  describe('createUnfinishedAbout', () => {
    it('should create unfinished about with base64 cover image', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      component.RequiredFormGroup.patchValue({
        coverImage: [mockFile],
        title: 'Test Title'
      });

      jest.spyOn(component as any, 'createUnfinishedRequired').mockReturnValue({
        title: 'Test Title',
        coverImage: [mockFile]
      });

      ProviderUtils.createUnfinishedAbout((component as any).createUnfinishedRequired()).subscribe((result) => {
        expect(result).toEqual({
          title: 'Test Title',
          coverImage: [mockFile],
          base64CoverImage: expect.stringMatching(/^data:image\/jpeg;base64,/)
        });
        done();
      });
    });

    it('should handle null cover image', (done) => {
      component.RequiredFormGroup.patchValue({
        coverImage: [null],
        title: 'Test Title'
      });

      jest.spyOn(component as any, 'createUnfinishedRequired').mockReturnValue({
        title: 'Test Title',
        coverImage: [null]
      });

      ProviderUtils.createUnfinishedAbout((component as any).createUnfinishedRequired()).subscribe((result) => {
        expect(result).toEqual({
          title: 'Test Title',
          coverImage: [null],
          base64CoverImage: null
        });
        done();
      });
    });
  });

  describe('createUnfinishedDescription', () => {
    beforeEach(() => {
      component.DescriptionFormGroup = new FormGroup({
        competitiveEventDescriptionItems: new FormControl([{ sectionName: 'Section 1', description: 'Description 1' }]),
        imageFiles: new FormControl([])
      });
    });

    it('should create unfinished description with base64 image files', (done) => {
      const mockFiles = [new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }), new File(['test2'], 'test2.png', { type: 'image/png' })];

      component.DescriptionFormGroup.patchValue({
        imageFiles: mockFiles
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result).toEqual({
          competitiveEventDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          imageFiles: mockFiles,
          base64ImageFiles: expect.arrayContaining([
            expect.stringMatching(/^data:image\/jpeg;base64,/),
            expect.stringMatching(/^data:image\/png;base64,/)
          ])
        });
        done();
      });
    });

    it('should handle empty imageFiles array', (done) => {
      component.DescriptionFormGroup.patchValue({
        imageFiles: []
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result).toEqual({
          competitiveEventDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          imageFiles: [],
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should handle null imageFiles', (done) => {
      component.DescriptionFormGroup.patchValue({
        imageFiles: null
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result).toEqual({
          competitiveEventDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          imageFiles: null,
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should handle undefined imageFiles', (done) => {
      component.DescriptionFormGroup.patchValue({
        imageFiles: undefined
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result).toEqual({
          competitiveEventDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          imageFiles: undefined,
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should merge data from both form groups correctly', (done) => {
      component.DescriptionFormGroup = new FormGroup({
        competitiveEventDescriptionItems: new FormControl([]),
        customField2: new FormControl('Custom value 2'),
        imageFiles: new FormControl([])
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result).toEqual({
          competitiveEventDescriptionItems: [],
          customField2: 'Custom value 2',
          imageFiles: [],
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should handle overlapping field names (DescriptionFormGroup should override)', (done) => {
      component.DescriptionFormGroup = new FormGroup({
        competitiveEventDescriptionItems: new FormControl([]),
        sharedField: new FormControl('Description value'),
        imageFiles: new FormControl([])
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result.sharedField).toBe('Description value');
        expect(result.base64ImageFiles).toEqual([]);
        done();
      });
    });

    it('should handle single file in imageFiles array', (done) => {
      const singleFile = new File(['single'], 'single.jpg', { type: 'image/jpeg' });

      component.DescriptionFormGroup.patchValue({
        imageFiles: [singleFile]
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result.imageFiles).toEqual([singleFile]);
        expect(result.base64ImageFiles[0]).toMatch(/^data:image\/jpeg;base64,/);
        done();
      });
    });

    it('should handle multiple files and verify base64 conversion', (done) => {
      const mockFiles = [new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }), new File(['test2'], 'test2.png', { type: 'image/png' })];

      component.DescriptionFormGroup.patchValue({
        imageFiles: mockFiles
      });

      ProviderUtils.createUnfinishedDescription({
        ...component.DescriptionFormGroup.getRawValue()
      }).subscribe((result) => {
        expect(result.imageFiles).toEqual(mockFiles);
        expect(result.base64ImageFiles.length).toEqual(2);
        expect(result.base64ImageFiles[0]).toMatch(/^data:image\/jpeg;base64,/);
        expect(result.base64ImageFiles[1]).toMatch(/^data:image\/png;base64,/);
        done();
      });
    });

    describe('createContactsWithCodeficator', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'createContacts');
        jest.spyOn(store, 'dispatch');
        jest.clearAllMocks();
      });

      it('should return contacts with codeficator data when catottgId exists', (done) => {
        const mockCodeficator = {
          id: 12345,
          name: 'Test Region',
          fullName: 'Test Region Full Name'
        };

        const mockContacts = [
          {
            id: 'contact1',
            name: 'Contact 1',
            address: {
              catottgId: 12345,
              street: 'Test Street',
              buildingNumber: '1'
            }
          }
        ];

        (component as any).createContacts.mockReturnValue(mockContacts);

        const codeficatorSubject = new Subject();
        Object.defineProperty(component, 'codeficator$', {
          get: () => codeficatorSubject.asObservable()
        });

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toHaveLength(1);
          expect(result[0].address.codeficatorAddress).toEqual(mockCodeficator);
          expect(result[0].address.street).toBe('Test Street');
          expect(result[0].address.buildingNumber).toBe('1');
          expect(store.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(12345));
          expect(store.dispatch).toHaveBeenCalledTimes(1);
          done();
        });

        setTimeout(() => {
          codeficatorSubject.next(mockCodeficator);
        }, 10);
      });

      it('should handle multiple contacts with different catottgIds', (done) => {
        const mockCodeficator1 = { id: 12345, name: 'Region 1' };
        const mockCodeficator2 = { id: 67890, name: 'Region 2' };

        const mockContacts = [
          { id: 'contact1', address: { catottgId: 12345, street: 'Street 1' } },
          { id: 'contact2', address: { catottgId: 67890, street: 'Street 2' } }
        ];

        (component as any).createContacts.mockReturnValue(mockContacts);
        const codeficatorSubject = new Subject();
        Object.defineProperty(component, 'codeficator$', {
          get: () => codeficatorSubject.asObservable()
        });

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toHaveLength(2);
          expect(result[0].address.codeficatorAddress).toEqual(mockCodeficator1);
          expect(result[1].address.codeficatorAddress).toEqual(mockCodeficator2);
          expect(store.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(12345));
          expect(store.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(67890));
          expect(store.dispatch).toHaveBeenCalledTimes(2);
          done();
        });

        setTimeout(() => {
          codeficatorSubject.next(mockCodeficator1);
          codeficatorSubject.next(mockCodeficator2);
        }, 10);
      });

      it('should return contact unchanged when no catottgId', (done) => {
        const mockContacts = [
          { id: 'contact1', name: 'Contact without address', phone: '+380123456789' },
          {
            id: 'contact2',
            name: 'Contact with address but no catottgId',
            address: { street: 'Test Street', buildingNumber: '1' }
          }
        ];

        (component as any).createContacts.mockReturnValue(mockContacts);

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toEqual(mockContacts);
          expect(store.dispatch).toHaveBeenCalledTimes(0);
          done();
        });
      });

      it('should handle null/undefined address', (done) => {
        const mockContacts = [
          { id: 'contact1', name: 'Contact with null address', address: null },
          { id: 'contact2', name: 'Contact with undefined address', address: undefined }
        ];

        (component as any).createContacts.mockReturnValue(mockContacts);

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toEqual(mockContacts);
          expect(store.dispatch).toHaveBeenCalledTimes(0);
          done();
        });
      });

      it('should handle empty contacts array', (done) => {
        (component as any).createContacts.mockReturnValue([]);

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toEqual([]);
          expect(store.dispatch).toHaveBeenCalledTimes(0);
          done();
        });
      });

      it('should filter codeficator by id and take only first match', (done) => {
        const correctCodeficator = { id: 12345, name: 'Correct Region' };
        const wrongCodeficator = { id: 99999, name: 'Wrong Region' };

        const mockContacts = [{ id: 'contact1', address: { catottgId: 12345, street: 'Test Street' } }];

        (component as any).createContacts.mockReturnValue(mockContacts);

        const codeficatorSubject = new Subject();
        Object.defineProperty(component, 'codeficator$', {
          get: () => codeficatorSubject.asObservable()
        });

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result[0].address.codeficatorAddress).toEqual(correctCodeficator);
          expect(result[0].address.codeficatorAddress).not.toEqual(wrongCodeficator);
          done();
        });

        setTimeout(() => {
          codeficatorSubject.next(wrongCodeficator);
          codeficatorSubject.next(correctCodeficator);
          codeficatorSubject.next({ id: 12345, name: 'Ignored' });
        }, 10);
      });
    });

    describe('createStepData', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(ProviderUtils, 'createUnfinishedAbout').mockReturnValue(of({ about: 'test about' }));
        jest.spyOn(ProviderUtils, 'createUnfinishedDescription').mockReturnValue(of({ description: 'test description' }));
        jest.spyOn(component as any, 'createContactsWithCodeficator').mockReturnValue(
          of([
            {
              id: 1,
              name: 'Test Contact'
            }
          ])
        );

        (component as any).unfinishedWorkshopTypeMap = {
          1: 'Type1',
          2: 'Type2',
          3: 'Type3',
          4: 'Type4'
        };

        (component as any).provider = { id: 'test-provider-id' };
      });

      it('should return baseData when step is 0', (done) => {
        (component as any).createStepData(0).subscribe((result) => {
          expect(result).toEqual({
            $type: undefined,
            providerId: 'test-provider-id'
          });
          done();
        });
      });

      it('should handle step 1 with only about data', (done) => {
        (component as any).createStepData(1).subscribe((result) => {
          expect(result).toEqual({
            $type: 'withAboutProperties',
            providerId: 'test-provider-id',
            about: 'test about'
          });
          done();
        });
      });

      it('should handle step 2 with about and description data', (done) => {
        (component as any).createStepData(2).subscribe((result) => {
          expect(result).toEqual({
            $type: 'withDescription',
            providerId: 'test-provider-id',
            about: 'test about',
            description: 'test description'
          });
          done();
        });
      });

      it('should handle step 3 with all data including contacts', (done) => {
        (component as any).createStepData(3).subscribe((result) => {
          expect(result).toEqual({
            $type: 'withContacts',
            providerId: 'test-provider-id',
            about: 'test about',
            description: 'test description',
            contacts: [{ id: 1, name: 'Test Contact' }]
          });

          expect(ProviderUtils.createUnfinishedAbout).toHaveBeenCalledTimes(1);
          expect(ProviderUtils.createUnfinishedDescription).toHaveBeenCalledTimes(1);
          expect((component as any).createContactsWithCodeficator).toHaveBeenCalledTimes(1);

          done();
        });
      });

      it('should merge overlapping properties correctly', (done) => {
        jest.spyOn(ProviderUtils, 'createUnfinishedAbout').mockReturnValue(
          of({
            name: 'from about',
            shared: 'about value'
          })
        );

        (component as any).createStepData(2).subscribe((result) => {
          expect(result).toEqual({
            $type: 'withDescription',
            providerId: 'test-provider-id',
            name: 'from about',
            shared: 'about value',
            description: 'test description'
          });
          done();
        });
      });
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

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of, Subject } from 'rxjs';

import { GetUnfinishedWorkshop, OnSaveWorkshopStep } from 'shared/store/provider.actions';
import { FormOfLearning, WorkshopType } from 'shared/enum/workshop';
import { UnfinishedWorkshopAbout } from 'shared/models/workshop.model';
import { StepperDirective } from 'shared/directives/stepper/stepper.directive';
import { Workshop, UnfinishedWorkshopType } from 'shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { GetCodeficatorById } from 'shared/store/meta-data.actions';
import { delay } from 'rxjs/operators';
import { CreateWorkshopComponent } from './create-workshop.component';

jest.mock('shared/utils/provider.utils', () => ({
  blobToBase64: jest.fn((blob) => of(`base64_${blob?.name || 'mock'}`)),
  blobsToBase64: jest.fn((blobs) => of(blobs.map((blob) => `base64_${blob?.name || 'mock'}`)))
}));

describe('CreateWorkshopComponent (Jest)', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;
  let routeMock: any;
  let storeMock: any;
  let matDialogMock: any;
  let activatedRouteMock: any;

  const mockProvider = { id: '08da842d-12fc-4865-85c5-ec6e6142abad' };
  const mockWorkshop: UnfinishedWorkshopAbout = {
    title: 'fkfkkff',
    shortTitle: 'fghjhgf',
    noAgeRestrictions: false,
    minAge: 2,
    maxAge: 5,
    studyPeriodDates: {
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    dateTimeRanges: [{ workdays: ['friday'], startTime: '12:22', endTime: '13:33' }],
    languageOfEducationId: 1,
    formOfLearning: FormOfLearning.Offline,
    availableSeats: 4294967295,
    base64CoverImage: 'image',
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    $type: UnfinishedWorkshopType.WithMainProperties
  };

  beforeEach(async () => {
    routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('unfinished')
        }
      }
    };

    matDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of(true)
      })
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockImplementation((key: string) => {
            if (key === 'entity') {
              return WorkshopType.Workshop;
            }
            return null;
          })
        }
      }
    };

    storeMock = {
      selectSnapshot: jest.fn().mockReturnValue({ id: mockWorkshop.providerId }),
      dispatch: jest.fn().mockResolvedValue(undefined),
      select: jest.fn((selector) => {
        if (typeof selector === 'function') {
          return of({ provider: { workshopDraft: mockWorkshop } });
        }
        return of(null);
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatDialogModule
      ],
      declarations: [CreateWorkshopComponent, StepperDirective],
      providers: [
        { provide: Store, useValue: storeMock },
        {
          provide: MatDialog,
          useValue: matDialogMock
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopComponent);
    component = fixture.componentInstance;
    component.AboutFormGroup = new FormGroup({
      availableSeats: new FormControl(mockWorkshop.availableSeats),
      dateTimeRanges: new FormControl(mockWorkshop.dateTimeRanges),
      formOfLearning: new FormControl(mockWorkshop.formOfLearning),
      maxAge: new FormControl(mockWorkshop.maxAge),
      minAge: new FormControl(mockWorkshop.minAge),
      shortTitle: new FormControl(mockWorkshop.shortTitle),
      title: new FormControl(mockWorkshop.title)
    });
    component.provider = mockProvider as any;
    component.AdditionalAboutGroup = new FormGroup({});
    component.DescriptionFormGroup = new FormGroup({});
    component.WorkshopContactsFormArray = new FormArray([]);
    component.TeacherFormArray = new FormArray([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return first invalid step index', () => {
    component.AboutFormGroup.get('title')?.setErrors({ required: true });
    expect((component as any).getFirstInvalidStep()).toBe(0);
  });

  it('should dispatch GetDraftWorkshop and set workshop data', (done) => {
    component.loadUnfinishedWorkshopData();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new GetUnfinishedWorkshop());
    (component as any).unfinishedWorkshop$.subscribe((draft) => {
      expect(draft).toEqual({ provider: { workshopDraft: mockWorkshop } });
      done();
    });
  });

  it('should not change stepper index if no invalid steps are found', () => {
    component.stepper = { selectedIndex: 0 } as any;
    jest.spyOn(component as any, 'getFirstInvalidStep').mockReturnValue(-1);

    component.loadUnfinishedWorkshopData();
    expect(component.stepper.selectedIndex).toBe(0);
  });

  it('should return if form is invalid', () => {
    const form = new FormGroup({
      mock: new FormControl(null)
    });
    form.setErrors({ invalid: true });
    (component as any).getRouteParam = jest.fn();
    component.saveUnfinishedData(form);
    expect((component as any).getRouteParam).not.toHaveBeenCalled();
  });

  it('should dispatch unfinished data correctly', () => {
    const step = 2;
    const extraData = { description: 'Test Description' };
    (component as any).dispatchUnfinishedData(step, extraData);

    expect(storeMock.dispatch).toHaveBeenCalledWith(new OnSaveWorkshopStep({ data: expect.any(Object), step }));
  });

  it('should execute stepActions correctly', () => {
    const step = 1;
    const mockData = { test: 'value' };
    jest.spyOn(component as any, 'createStepData').mockReturnValue(of(mockData));
    jest.spyOn(component as any, 'dispatchUnfinishedData');

    (component as any).stepActions[step]();

    expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(step, mockData);
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

    it('should execute step 4 action correctly', (done) => {
      (component as any).stepActions[4]();

      setTimeout(() => {
        expect((component as any).createStepData).toHaveBeenCalledWith(4);
        expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(4, { mockData: 'test' });
        done();
      }, 0);
    });
  });

  describe('createUnfinishedAbout', () => {
    it('should create unfinished about with base64 cover image', (done) => {
      const mockFile = new File(['test'], 'test.jpg');
      component.AboutFormGroup.patchValue({
        coverImage: [mockFile],
        title: 'Test Title'
      });

      jest.spyOn(component as any, 'createAbout').mockReturnValue({
        title: 'Test Title',
        coverImage: [mockFile]
      });

      (component as any).createUnfinishedAbout().subscribe((result) => {
        expect(result).toEqual({
          title: 'Test Title',
          coverImage: [mockFile],
          base64CoverImage: 'base64_test.jpg'
        });
        done();
      });
    });

    it('should handle null cover image', (done) => {
      component.AboutFormGroup.patchValue({
        coverImage: [null],
        title: 'Test Title'
      });

      jest.spyOn(component as any, 'createAbout').mockReturnValue({
        title: 'Test Title',
        coverImage: [null]
      });

      (component as any).createUnfinishedAbout().subscribe((result) => {
        expect(result).toEqual({
          title: 'Test Title',
          coverImage: [null],
          base64CoverImage: 'base64_mock'
        });
        done();
      });
    });
  });

  describe('createUnfinishedDescription', () => {
    beforeEach(() => {
      component.AdditionalAboutGroup = new FormGroup({
        competitiveSelectionDescription: new FormControl('Test competitive description'),
        enrollmentProcedureDescription: new FormControl('Test enrollment procedure')
      });

      component.DescriptionFormGroup = new FormGroup({
        workshopDescriptionItems: new FormControl([{ sectionName: 'Section 1', description: 'Description 1' }]),
        keywords: new FormControl(['keyword1', 'keyword2']),
        imageFiles: new FormControl([])
      });
    });

    it('should create unfinished description with base64 image files', (done) => {
      const mockFiles = [new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }), new File(['test2'], 'test2.png', { type: 'image/png' })];

      component.DescriptionFormGroup.patchValue({
        imageFiles: mockFiles
      });

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result).toEqual({
          competitiveSelectionDescription: 'Test competitive description',
          enrollmentProcedureDescription: 'Test enrollment procedure',
          workshopDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          keywords: ['keyword1', 'keyword2'],
          imageFiles: mockFiles,
          base64ImageFiles: ['base64_test1.jpg', 'base64_test2.png']
        });
        done();
      });
    });

    it('should handle empty imageFiles array', (done) => {
      component.DescriptionFormGroup.patchValue({
        imageFiles: []
      });

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result).toEqual({
          competitiveSelectionDescription: 'Test competitive description',
          enrollmentProcedureDescription: 'Test enrollment procedure',
          workshopDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          keywords: ['keyword1', 'keyword2'],
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

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result).toEqual({
          competitiveSelectionDescription: 'Test competitive description',
          enrollmentProcedureDescription: 'Test enrollment procedure',
          workshopDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          keywords: ['keyword1', 'keyword2'],
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

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result).toEqual({
          competitiveSelectionDescription: 'Test competitive description',
          enrollmentProcedureDescription: 'Test enrollment procedure',
          workshopDescriptionItems: [{ sectionName: 'Section 1', description: 'Description 1' }],
          keywords: ['keyword1', 'keyword2'],
          imageFiles: undefined,
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should merge data from both form groups correctly', (done) => {
      component.AdditionalAboutGroup = new FormGroup({
        competitiveSelectionDescription: new FormControl('Additional competitive'),
        customField1: new FormControl('Custom value 1')
      });

      component.DescriptionFormGroup = new FormGroup({
        workshopDescriptionItems: new FormControl([]),
        keywords: new FormControl(['test']),
        customField2: new FormControl('Custom value 2'),
        imageFiles: new FormControl([])
      });

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result).toEqual({
          competitiveSelectionDescription: 'Additional competitive',
          customField1: 'Custom value 1',
          workshopDescriptionItems: [],
          keywords: ['test'],
          customField2: 'Custom value 2',
          imageFiles: [],
          base64ImageFiles: []
        });
        done();
      });
    });

    it('should handle overlapping field names (DescriptionFormGroup should override AdditionalAboutGroup)', (done) => {
      component.AdditionalAboutGroup = new FormGroup({
        competitiveSelectionDescription: new FormControl('From Additional'),
        sharedField: new FormControl('Additional value')
      });

      component.DescriptionFormGroup = new FormGroup({
        workshopDescriptionItems: new FormControl([]),
        sharedField: new FormControl('Description value'),
        imageFiles: new FormControl([])
      });

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result.competitiveSelectionDescription).toBe('From Additional');
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

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result.imageFiles).toEqual([singleFile]);
        expect(result.base64ImageFiles).toEqual(['base64_single.jpg']);
        done();
      });
    });

    it('should handle multiple files and verify base64 conversion', (done) => {
      const mockFiles = [new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }), new File(['test2'], 'test2.png', { type: 'image/png' })];

      component.DescriptionFormGroup.patchValue({
        imageFiles: mockFiles
      });

      (component as any).createUnfinishedDescription().subscribe((result) => {
        expect(result.imageFiles).toEqual(mockFiles);
        expect(result.base64ImageFiles).toEqual(['base64_test1.jpg', 'base64_test2.png']);
        done();
      });
    });

    describe('createContactsWithCodeficator', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'createContacts');
        jest.spyOn(storeMock, 'dispatch');
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
          expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(12345));
          expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
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
          expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(12345));
          expect(storeMock.dispatch).toHaveBeenCalledWith(new GetCodeficatorById(67890));
          expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
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
          expect(storeMock.dispatch).toHaveBeenCalledTimes(0);
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
          expect(storeMock.dispatch).toHaveBeenCalledTimes(0);
          done();
        });
      });

      it('should handle empty contacts array', (done) => {
        (component as any).createContacts.mockReturnValue([]);

        (component as any).createContactsWithCodeficator().subscribe((result) => {
          expect(result).toEqual([]);
          expect(storeMock.dispatch).toHaveBeenCalledTimes(0);
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
        jest.spyOn(component as any, 'createUnfinishedAbout').mockReturnValue(of({ about: 'test about' }));
        jest.spyOn(component as any, 'createAdditionalAbout').mockReturnValue({ additional: 'test additional' });
        jest.spyOn(component as any, 'createUnfinishedDescription').mockReturnValue(of({ description: 'test description' }));
        jest.spyOn(component as any, 'createContactsWithCodeficator').mockReturnValue(of([{ id: 1, name: 'Test Contact' }]));

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
            $type: 'Type1',
            providerId: 'test-provider-id',
            about: 'test about'
          });
          done();
        });
      });

      it('should handle step 2 with about and additional data', (done) => {
        (component as any).createStepData(2).subscribe((result) => {
          expect(result).toEqual({
            $type: 'Type2',
            providerId: 'test-provider-id',
            about: 'test about',
            additional: 'test additional'
          });
          done();
        });
      });

      it('should handle step 3 with about, additional and description data', (done) => {
        (component as any).createStepData(3).subscribe((result) => {
          expect(result).toEqual({
            $type: 'Type3',
            providerId: 'test-provider-id',
            about: 'test about',
            additional: 'test additional',
            description: 'test description'
          });
          done();
        });
      });

      it('should handle step 4 with all data including contacts', (done) => {
        (component as any).createStepData(4).subscribe((result) => {
          expect(result).toEqual({
            $type: 'Type4',
            providerId: 'test-provider-id',
            about: 'test about',
            additional: 'test additional',
            description: 'test description',
            contacts: [{ id: 1, name: 'Test Contact' }]
          });

          expect((component as any).createUnfinishedAbout).toHaveBeenCalledTimes(1);
          expect((component as any).createAdditionalAbout).toHaveBeenCalledTimes(1);
          expect((component as any).createUnfinishedDescription).toHaveBeenCalledTimes(1);
          expect((component as any).createContactsWithCodeficator).toHaveBeenCalledTimes(1);

          done();
        });
      });

      it('should merge overlapping properties correctly', (done) => {
        (component as any).createUnfinishedAbout.mockReturnValue(of({ name: 'from about', shared: 'about value' }));
        (component as any).createAdditionalAbout.mockReturnValue({
          name: 'from additional',
          shared: 'additional value',
          extra: 'additional extra'
        });

        (component as any).createStepData(2).subscribe((result) => {
          expect(result).toEqual({
            $type: 'Type2',
            providerId: 'test-provider-id',
            name: 'from additional',
            shared: 'additional value',
            extra: 'additional extra'
          });
          done();
        });
      });

      it('should handle async data correctly', (done) => {
        (component as any).createUnfinishedAbout.mockReturnValue(of({ about: 'delayed about' }).pipe(delay(100)));
        (component as any).createUnfinishedDescription.mockReturnValue(of({ description: 'delayed description' }).pipe(delay(50)));

        (component as any).createStepData(3).subscribe((result) => {
          expect(result).toEqual({
            $type: 'Type3',
            providerId: 'test-provider-id',
            about: 'delayed about',
            additional: 'test additional',
            description: 'delayed description'
          });
          done();
        });
      }, 10000);
    });

    describe('shouldBeDraft', () => {
      let anotherWorkshop: Workshop;

      beforeEach(() => {
        component.workshop = {
          title: 'Title',
          shortTitle: 'Short',
          coverImage: new File([''], 'filename.jpg', { type: 'image/jpeg' }),
          imageFiles: [new File([''], 'filename1.jpg', { type: 'image/jpeg' }), new File([''], 'filename2.jpg', { type: 'image/jpeg' })],
          competitiveSelectionDescription: 'desc',
          workshopDescriptionItems: [
            { sectionName: 'hel2', description: 'hel2' },
            { sectionName: 'hel2', description: 'hel2' }
          ],
          keywords: ['a', 'b'],
          enrollmentProcedureDescription: 'enroll',
          preferentialTermsOfParticipation: 'terms'
        };

        anotherWorkshop = {
          title: 'Title',
          shortTitle: 'Short',
          coverImage: new File([''], 'filename.jpg', { type: 'image/jpeg' }),
          imageFiles: [new File([''], 'filename1.jpg', { type: 'image/jpeg' }), new File([''], 'filename2.jpg', { type: 'image/jpeg' })],
          competitiveSelectionDescription: 'desc',
          workshopDescriptionItems: [
            { sectionName: 'hel2', description: 'hel2' },
            { sectionName: 'hel2', description: 'hel2' }
          ],
          keywords: ['a', 'b'],
          enrollmentProcedureDescription: 'enroll',
          preferentialTermsOfParticipation: 'terms'
        } as Workshop;
      });

      it('should NOT be draft', () => {
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(false);
      });

      it('should be draft if primitives changed', () => {
        anotherWorkshop.title = 'Another Title';

        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
      });

      it('arrays changed', () => {
        anotherWorkshop.keywords = ['a', 'c'];
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
        anotherWorkshop.keywords = ['a', 'b', 'c'];
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
        anotherWorkshop.keywords = ['b', 'a'];
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(false);
      });

      it('should be draft if coverImage changed', () => {
        anotherWorkshop.coverImage = new File([''], 'filename1.jpg', { type: 'image/png' });
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);

        anotherWorkshop.coverImage = null;
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
      });

      it('should be draft if files changed', () => {
        anotherWorkshop.imageFiles = [
          new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
          new File([''], 'filename3.jpg', { type: 'image/jpeg' })
        ];
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);

        anotherWorkshop.imageFiles = [
          new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
          new File([''], 'filename2.jpg', { type: 'image/jpeg' }),
          new File([''], 'filename3.jpg', { type: 'image/jpeg' })
        ];
        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
      });

      it('should be draft if keyword are falsy', () => {
        anotherWorkshop.keywords = null;
        component.workshop.keywords = [''];

        expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(false);
      });

      describe('should be draft if workshopDescriptionItems changed', () => {
        afterEach(() => {
          expect((component as any).shouldBeDraft(anotherWorkshop)).toBe(true);
        });

        it('length changed', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: 'hel2', description: 'hel2' },
            { sectionName: 'hel2', description: 'hel2' },
            { sectionName: 'hel3', description: 'hel3' }
          ];
        });

        it('sectionName changed', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: 'hel1', description: 'hel2' },
            { sectionName: 'hel2', description: 'hel2' }
          ];
        });

        it('description changed', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: 'hel2', description: 'hel3' },
            { sectionName: 'hel2', description: 'hel2' }
          ];
        });

        it('structure changed', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: 'hel2', description: 'hel3', workshopId: '123' },
            { sectionName: 'hel2', description: 'hel2' }
          ];
        });

        it('partially null', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: null, description: 'hel3' },
            { sectionName: 'hel2', description: 'hel2' }
          ];
        });

        it('partially undefined', () => {
          anotherWorkshop.workshopDescriptionItems = [
            { sectionName: undefined, description: 'hel3' },
            { sectionName: 'hel2', description: 'hel2' }
          ];
        });

        it('fully null', () => {
          anotherWorkshop.workshopDescriptionItems = [null, { sectionName: 'hel2', description: 'hel2' }];
        });

        it('fully undefined', () => {
          anotherWorkshop.workshopDescriptionItems = [undefined, null];
        });
      });

      it('should be draft matDialog', () => {
        jest.spyOn(component, 'shouldBeDraft').mockReturnValue(true);

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
        jest.spyOn(component, 'shouldBeDraft').mockReturnValue(false);

        component.editMode = true;

        component.onSubmit();

        expect(matDialogMock.open).not.toHaveBeenCalled();
      });
    });
  });
});

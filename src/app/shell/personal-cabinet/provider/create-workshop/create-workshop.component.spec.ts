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
import { of } from 'rxjs';

import { GetUnfinishedWorkshop, OnSaveWorkshopStep } from 'shared/store/provider.actions';
import { FormOfLearning, WorkshopType } from 'shared/enum/workshop';
import { UnfinishedWorkshopAbout } from 'shared/models/workshop.model';
import { StepperDirective } from 'shared/directives/stepper/stepper.directive';
import { Workshop, UnfinishedWorkshopType } from 'shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateWorkshopComponent } from './create-workshop.component';

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
      dispatch: jest.fn().mockResolvedValue(undefined), // Mock async dispatch
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

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';
import { GetUnfinishedWorkshop, OnSaveWorkshopStep } from 'shared/store/provider.actions';
import { FormOfLearning, WorkshopType } from 'shared/enum/workshop';
import { WorkshopMainRequiredProperties } from 'shared/models/draftWorkshop.model';

import { TranslateModule } from '@ngx-translate/core';
import { StepperDirective } from 'shared/directives/stepper/stepper.directive';
import { Workshop } from 'shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateWorkshopComponent } from './create-workshop.component';
import { ActivatedRoute } from '@angular/router';

describe('CreateWorkshopComponent (Jest)', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;
  let routeMock: any;
  let storeMock: any;
  let matDialogMock: any;
  let activatedRouteMock: any;

  const mockProvider = { id: '08da842d-12fc-4865-85c5-ec6e6142abad' };
  const mockWorkshop: WorkshopMainRequiredProperties = {
    availableSeats: 4294967295,
    competitiveSelection: false,
    competitiveSelectionDescription: null,
    dateTimeRanges: [{ workdays: ['friday'], startTime: '12:22', endTime: '13:33' }],
    formOfLearning: FormOfLearning.Offline,
    maxAge: 5,
    minAge: 2,
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    shortTitle: 'fghjhgf',
    title: 'fkfkkff'
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
      competitiveSelection: new FormControl(mockWorkshop.competitiveSelection),
      competitiveSelectionDescription: new FormControl(mockWorkshop.competitiveSelectionDescription),
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

  it('should createDraftData correctly', () => {
    const step = 1;
    const extraData = { title: 'Test Workshop' };
    const draftData = (component as any).createDraftData(step, extraData);

    expect(draftData).toEqual({
      $type: (component as any).unfinishedWorkshopTypeMap[step],
      ...(component as any).createAbout(),
      providerId: component.provider.id,
      ...extraData
    });
  });

  it('should return if form is invalid', () => {
    const form = new FormGroup({
      mock: new FormControl(null)
    });
    form.setErrors({ invalid: true });
    component.getRouteParam = jest.fn();
    component.saveUnfinishedData(form);
    expect(component.getRouteParam).not.toHaveBeenCalled();
  });

  it('should dispatch unfinished data correctly', () => {
    const step = 2;
    const extraData = { description: 'Test Description' };
    (component as any).dispatchUnfinishedData(step, extraData);

    expect(storeMock.dispatch).toHaveBeenCalledWith(new OnSaveWorkshopStep({ data: expect.any(Object), step }));
  });

  it('should execute stepActions correctly', () => {
    const step = 1;
    jest.spyOn(component as any, 'dispatchUnfinishedData');
    (component as any).stepActions[step]();

    expect((component as any).dispatchUnfinishedData).toHaveBeenCalledWith(1, expect.any(Object));
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
        disabilityOptionsDesc: 'Option',
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
        disabilityOptionsDesc: 'Option',
        keywords: ['a', 'b'],
        enrollmentProcedureDescription: 'enroll',
        preferentialTermsOfParticipation: 'terms'
      } as Workshop;
    });

    it('should NOT be draft', () => {
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(false);
    });

    it('should be draft if primitives changed', () => {
      anotherWorkshop.title = 'Another Title';

      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
    });

    it('should be draft if arrays changed', () => {
      anotherWorkshop.keywords = ['a', 'c'];
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
      anotherWorkshop.keywords = ['a', 'b', 'c'];
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
    });

    it('shoild be draft if coverImage changed', () => {
      anotherWorkshop.coverImage = new File([''], 'filename1.jpg', { type: 'image/png' });
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);

      anotherWorkshop.coverImage = null;
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
    });

    it('should be draft if files changed', () => {
      anotherWorkshop.imageFiles = [
        new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename3.jpg', { type: 'image/jpeg' })
      ];
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);

      anotherWorkshop.imageFiles = [
        new File([''], 'filename1.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename2.jpg', { type: 'image/jpeg' }),
        new File([''], 'filename3.jpg', { type: 'image/jpeg' })
      ];
      expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
    });

    describe('should be draft if workshopDescriptionItems changed', () => {
      afterEach(() => {
        expect(component.shouldBeDraft(anotherWorkshop)).toBe(true);
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

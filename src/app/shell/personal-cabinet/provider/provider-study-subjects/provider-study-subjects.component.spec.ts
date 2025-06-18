import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDatepickerInputEvent, MatDateRangePicker } from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import moment from 'moment';
import { Moment } from 'moment/moment';

import { PaginatorComponent } from 'shared/components/paginator/paginator.component';
import { GetStudySubjects } from 'shared/store/provider.actions';
import { StudySubject } from 'shared/models/study-subject.model';
import { LanguageId } from 'shared/enum/language-id';
import { ProviderStudySubjectsComponent } from './provider-study-subjects.component';

describe('ProviderStudySubjectsComponent', () => {
  let component: ProviderStudySubjectsComponent;
  let fixture: ComponentFixture<ProviderStudySubjectsComponent>;
  let store: Store;

  const mockSubject = (overrides?: Partial<StudySubject>): StudySubject => ({
    id: '123',
    nameInUkrainian: 'Math',
    nameInInstructionLanguage: 'Mathematics',
    isLanguageUkrainian: true,
    languageId: LanguageId.Ukrainian,
    language: {
      id: 2,
      code: 'UA',
      name: 'Ukrainian'
    },
    activeFrom: '2023-01-01',
    activeTo: '2023-12-31',
    workshopId: '456',
    providerId: '1',
    ...overrides
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatTableModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        MatFormFieldModule,
        RouterTestingModule,
        MatInputModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      declarations: [ProviderStudySubjectsComponent, PaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderStudySubjectsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    component.provider = { id: '1' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onItemsPerPageChange', () => {
    it('should update items per page and fetch study subjects', () => {
      jest.spyOn(component, 'onPageChange');
      const itemsPerPage = 20;

      component.onItemsPerPageChange(itemsPerPage);

      expect(component.subjectParameters.size).toBe(itemsPerPage);
      expect(component.onPageChange).toHaveBeenCalledWith(component.currentPage);
    });
  });

  describe('getStudySubjects', () => {
    it('should dispatch GetStudySubjects action', () => {
      (component as any).provider = { id: '1', providerId: '123' } as StudySubject;
      jest.spyOn(store, 'dispatch');

      (component as any).getStudySubjects();

      expect(store.dispatch).toHaveBeenCalledWith(new GetStudySubjects(component.subjectParameters));
    });
  });

  describe('initProviderData', () => {
    it('should initialize provider data and subscribe to study subjects', () => {
      const mockSubjects = {
        entities: [mockSubject()],
        totalAmount: 1
      };

      jest.spyOn(store, 'select').mockReturnValue(of(mockSubjects));
      jest.spyOn(component as any, 'getStudySubjects').mockImplementation(() => {});

      component.initProviderData();

      expect((component as any).getStudySubjects).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockSubjects.entities);
      expect(component.totalElements).toBe(mockSubjects.totalAmount);
    });
  });

  describe('DatePicker', () => {
    let mockDate: Moment;
    beforeEach(async () => {
      mockDate = moment('2025-05-05T00:00:00Z');
      component.picker = {
        _componentRef: {
          instance: {
            _calendar: {
              selectedChange: of(mockDate)
            }
          }
        },
        open: jest.fn(),
        openedStream: of(true)
      } as unknown as MatDateRangePicker<Date>;

      component.filterForm = new FormGroup({
        filterFormControl: new FormControl(''),
        dateFrom: new FormControl<Moment | null>(null),
        dateTo: new FormControl<Moment | null>(null)
      });
    });

    it('should set tempDateFrom', fakeAsync(() => {
      component.ngAfterViewInit();
      component.picker.open();
      tick();
      expect(component.tempDateFrom).toEqual(mockDate);
    }));

    it('should set tempDateTo', fakeAsync(() => {
      component.ngAfterViewInit();
      component.tempDateFrom = mockDate.subtract(1, 'days');
      component.picker.open();
      tick();
      expect(component.tempDateTo).toEqual(mockDate);
    }));

    it('should update tempDateFrom', fakeAsync(() => {
      component.ngAfterViewInit();
      component.tempDateFrom = mockDate.add(10, 'days');
      component.tempDateTo = mockDate;
      component.picker.open();
      tick();
      expect(component.tempDateFrom).toEqual(mockDate);
    }));

    it('should update form fields and set filters on apply button push', () => {
      component.tempDateFrom = mockDate;
      component.tempDateTo = mockDate;
      jest.spyOn(component, 'setDateForFilters');
      component.onDateApply();
      expect(component.filterForm.get('dateFrom').value).toEqual(component.tempDateFrom);
      expect(component.filterForm.get('dateTo').value).toEqual(component.tempDateTo);
      expect(component.setDateForFilters).toHaveBeenCalled();
    });

    it('should update form fields and set filters on keyboard input', () => {
      const expectedDate = mockDate.add(3, 'months').startOf('day');
      component.onDateInput({ target: { value: mockDate.add(3, 'months') } } as MatDatepickerInputEvent<Moment>, 'dateFrom');
      expect(component.filterForm.get('dateFrom').value).toEqual(expectedDate);
    });

    it('should format date', () => {
      component.filterForm.get('dateFrom').setValue(mockDate);
      component.filterForm.get('dateTo').setValue(mockDate);
      component.setDateForFilters();
      expect(component.subjectParameters.dateFrom).toEqual(mockDate.format('YYYY-MM-DD'));
      expect(component.subjectParameters.dateTo).toEqual(mockDate.format('YYYY-MM-DD'));
    });

    it('should dispatch get study subjects', () => {
      const mockSubjectParameters = { dateFrom: mockDate.toISOString(), dateTo: mockDate.toISOString() };
      component.subjectParameters = mockSubjectParameters;
      jest.spyOn(store, 'dispatch');
      component.setDateForFilters();
      expect(store.dispatch).toHaveBeenCalledWith(new GetStudySubjects(mockSubjectParameters));
    });
  });
});

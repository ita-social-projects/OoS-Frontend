import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent, MatDateRangePicker } from '@angular/material/datepicker';
import { Store } from '@ngxs/store';
import { ProviderState } from 'shared/store/provider.state';
import { PushNavPath } from 'shared/store/navigation.actions';
import { DeleteStudySubjectById, GetStudySubjects } from 'shared/store/provider.actions';
import { debounceTime, distinctUntilChanged, EMPTY, filter, map, merge, skip, startWith, takeUntil } from 'rxjs';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { DATE_REGEX } from 'shared/constants/regex-constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { FilterOptions } from 'shared/enum/history.log';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { StudySubject, StudySubjectParameters } from 'shared/models/study-subject.model';
import { SearchResponse } from 'shared/models/search.model';
import { Util } from 'shared/utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { delay, switchMap } from 'rxjs/operators';
import { DateAdapter } from '@angular/material/core';
import { Moment } from 'moment';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-study-subjects',
  templateUrl: './provider-study-subjects.component.html',
  styleUrls: ['./provider-study-subjects.component.scss']
})
export class ProviderStudySubjectsComponent extends ProviderComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatDateRangePicker) public picker: MatDateRangePicker<Date>;

  public readonly Constants = Constants;
  public readonly ModeConstants = ModeConstants;
  public readonly noStudySubjects = NoResultsTitle.noStudySubjects;
  public readonly debounceInputTime = 1000;
  public readonly dateFilter = DATE_REGEX;
  public displayedColumns: string[] = [
    'nameInUkrainian',
    'activeFrom',
    'activeTo',
    'workshopId',
    'nameInInstructionLanguage',
    'language',
    'actions'
  ];
  public isLoaded: boolean = false;
  public totalElements = 0;
  public maxDate = new Date();
  public notAllowedToPickByTabButton = -1;
  public dataSource: MatTableDataSource<StudySubject> = new MatTableDataSource<StudySubject>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public subjectParameters: StudySubjectParameters = {
    providerId: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public filterForm: FormGroup;
  public tempDateFrom: Moment | null = null;
  public tempDateTo: Moment | null = null;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    protected adapter: DateAdapter<any>
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    console.log(this.adapter);

    this.filterForm = new FormGroup({
      filterFormControl: new FormControl(''),
      dateFrom: new FormControl<Date | null>(null),
      dateTo: new FormControl<Date | null>(null)
    });

    this.filterForm
      .get('filterFormControl')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(this.debounceInputTime),
        takeUntil(this.destroy$),
        map((searchedText: string) => searchedText.trim())
      )
      .subscribe((searchedText: string) => {
        this.subjectParameters.searchString = searchedText;

        this.currentPage = PaginationConstants.firstPage;
        this.getStudySubjects();
      });

    // this.onDateInput$.pipe(takeUntil(this.destroy$), debounceTime(this.debounceInputTime)).subscribe(({ controlName, value }) => {
    //   this.filterForm.get(controlName).setValue(value);
    //   if (this.filterForm.get(controlName).valid) {
    //     this.setDateForFilters();
    //   }
    // });

    merge(...['dateFrom', 'dateTo'].map((controlName) => this.filterForm.get(controlName)?.valueChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setDateForFilters();
      });
  }

  public ngAfterViewInit(): void {
    this.listenToDateOnPickerOpened();
  }

  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Subjects,
        isActive: false,
        disable: true
      })
    );
  }

  public initProviderData(): void {
    this.subjectParameters.providerId = this.provider.id;
    this.getStudySubjects();
    this.store
      .select(ProviderState.studySubject)
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((subjects: SearchResponse<StudySubject[]>) => {
        this.dataSource.data = subjects.entities;
        this.totalElements = subjects.totalAmount;
        this.isLoaded = true;
        this.dataSource.sort = this.sort;
      });
  }

  public onDelete(subject: StudySubject): void {
    this.matDialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: { type: ModalConfirmationType.deleteSubject, property: subject.nameInUkrainian }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new DeleteStudySubjectById(this.subjectParameters, subject.id)));
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.subjectParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getStudySubjects();
  }

  public closeDatePicker(): void {
    if (this.picker) {
      this.picker.close();
    }
  }

  public onResetFilters(): void {
    this.filterForm.patchValue({
      dateFrom: '',
      dateTo: ''
    });
    this.subjectParameters.dateFrom = '';
    this.subjectParameters.dateTo = '';
    this.closeDatePicker();

    this.getStudySubjects();
  }

  public setDateForFilters(): void {
    const { dateFrom, dateTo } = this.filterForm.value;
    const dateFilters = this.setTimePeriodEqualToWholeDay(dateFrom, dateTo);
    this.subjectParameters.dateFrom = dateFilters.dateFrom;
    this.subjectParameters.dateTo = dateFilters.dateTo;
    this.getStudySubjects();
  }

  public onDateApply(): void {
    this.filterForm.patchValue({ dateFrom: this.tempDateFrom.toDate(), dateTo: this.tempDateTo.toDate() });
  }

  public onDateInput(event: MatDatepickerInputEvent<Moment>, controlName: 'dateFrom' | 'dateTo'): void {
    console.log('==============');
    // console.log(event.target.value.toDate());
    console.log(event.target.value);
    console.log('==============');
    if (event.target.value) {
      this.filterForm.get(controlName)?.patchValue(event.target.value?.toDate());
    } else {
      console.log('null');
    }
  }

  public listenToDateOnPickerOpened(): void {
    this.picker?.openedStream
      .pipe(
        takeUntil(this.destroy$),
        delay(0),
        switchMap(() => {
          const calendar = (this.picker as any)?._componentRef?.instance._calendar;
          return calendar ? calendar.selectedChange : EMPTY;
        })
      )
      .subscribe((date: Moment) => {
        if (!this.tempDateFrom || (date < this.tempDateFrom && !this.tempDateTo)) {
          this.tempDateFrom = date;
          // this.filterForm.patchValue({ dateFrom: date });
        } else if (!this.tempDateTo) {
          this.tempDateTo = date;
          // this.filterForm.patchValue({ dateTo: date });
        } else {
          this.tempDateFrom = date;
          this.tempDateTo = null;
          // this.filterForm.patchValue({ dateFrom: date, dateTo: null });
        }
      });
  }

  private setCustomTimeInDate(date: Date, hours: number, minutes: number, seconds: number): void {
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
  }

  private setTimeDependsOnTimezone(dateFrom?: Date, dateTo?: Date): StudySubjectParameters {
    const result: StudySubjectParameters = {};

    if (dateFrom) {
      const timezoneGap = dateFrom.getTimezoneOffset() * 60 * 1000;
      const dateFromWithTimezoneGap = dateFrom.getTime() - timezoneGap;
      result[FilterOptions.DateFrom] = new Date(dateFromWithTimezoneGap).toISOString().split('T')[0];
    }

    if (dateTo) {
      const timezoneGap = dateTo.getTimezoneOffset() * 60 * 1000;
      const dateToWithTimezoneGap = dateTo.getTime() - timezoneGap;
      result[FilterOptions.DateTo] = new Date(dateToWithTimezoneGap).toISOString().split('T')[0];
    }

    return result;
  }

  private setTimePeriodEqualToWholeDay(dateFrom?: Date, dateTo?: Date): StudySubjectParameters {
    if (dateFrom) {
      this.setCustomTimeInDate(dateFrom, 0, 0, 0);
    }

    if (dateTo) {
      this.setCustomTimeInDate(dateTo, 23, 59, 59);
    }

    return this.setTimeDependsOnTimezone(dateFrom, dateTo);
  }

  private getStudySubjects(): void {
    this.subjectParameters.providerId = this.provider.id;
    Util.setFromPaginationParam(this.subjectParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetStudySubjects(this.subjectParameters));
  }
}

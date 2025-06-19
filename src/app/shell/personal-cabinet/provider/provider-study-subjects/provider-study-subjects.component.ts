import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent, MatDateRangePicker } from '@angular/material/datepicker';
import { Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, EMPTY, filter, map, skip, startWith, takeUntil } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import moment, { Moment } from 'moment';

import { ProviderState } from 'shared/store/provider.state';
import { PushNavPath } from 'shared/store/navigation.actions';
import { DeleteStudySubjectById, GetStudySubjects } from 'shared/store/provider.actions';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { DATE_REGEX } from 'shared/constants/regex-constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { StudySubject, StudySubjectParameters } from 'shared/models/study-subject.model';
import { SearchResponse } from 'shared/models/search.model';
import { Util } from 'shared/utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-study-subjects',
  templateUrl: './provider-study-subjects.component.html',
  styleUrls: ['./provider-study-subjects.component.scss']
})
export class ProviderStudySubjectsComponent extends ProviderComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatDateRangePicker) public picker: MatDateRangePicker<Date>;
  @ViewChild('DateFromInput') public dateFromInput: ElementRef;
  @ViewChild('DateToInput') public dateToInput: ElementRef;

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
    private formBuilder: FormBuilder
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.filterForm = new FormGroup({
      filterFormControl: new FormControl(''),
      dates: this.formBuilder.group({
        dateFrom: new FormControl<Moment | null>(null),
        dateTo: new FormControl<Moment | null>(null)
      })
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
    this.filterForm.get('dates').patchValue({
      dateFrom: null,
      dateTo: null
    });
    this.tempDateFrom = null;
    this.tempDateTo = null;
    this.dateFromInput.nativeElement.value = '';
    this.dateToInput.nativeElement.value = '';
    this.subjectParameters.dateFrom = '';
    this.subjectParameters.dateTo = '';
    this.closeDatePicker();

    this.getStudySubjects();
  }

  public onDateApply(): void {
    this.filterForm.patchValue({ dateFrom: this.tempDateFrom, dateTo: this.tempDateTo });
    this.setDateForFilters();
  }

  public onDateInput(event: MatDatepickerInputEvent<string>, controlName: 'dateFrom' | 'dateTo'): void {
    const raw = (event.targetElement as HTMLInputElement).value;
    this.filterForm.get('dates').get(controlName)?.patchValue(event.target.value);
    this.filterForm.get('dates').get(controlName)?.markAsTouched();
    this.validateDate(raw, controlName);
    this.setDateForFilters();
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
        } else if (!this.tempDateTo) {
          this.tempDateTo = date;
        } else {
          this.tempDateFrom = date;
          this.tempDateTo = null;
        }
      });
  }

  public setDateForFilters(): void {
    this.setTimeFormat();
    this.getStudySubjects();
  }

  private setTimeFormat(): void {
    this.subjectParameters.dateFrom = this.filterForm.value.dates.dateFrom?.format('YYYY-MM-DD') ?? '';
    this.subjectParameters.dateTo = this.filterForm.value.dates.dateTo?.format('YYYY-MM-DD') ?? '';
  }

  private getStudySubjects(): void {
    this.subjectParameters.providerId = this.provider.id;
    Util.setFromPaginationParam(this.subjectParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetStudySubjects(this.subjectParameters));
  }

  private validateDate(raw: string, controlName: string): void {
    const date = moment(raw, 'DD/MM/YYYY', true);

    if (!date.isValid()) {
      this.filterForm.get('dates').setErrors(null);
      return;
    }

    if (controlName === 'dateFrom' && date.isAfter(this.filterForm.get('dates.dateTo')?.value, 'day')) {
      this.filterForm.get('dates').setErrors({ invalidDateRange: true });
    } else if (controlName === 'dateTo' && date.isBefore(this.filterForm.get('dates.dateFrom')?.value, 'day')) {
      this.filterForm.get('dates').setErrors({ invalidDateRange: true });
    } else {
      this.filterForm.get('dates').setErrors(null);
    }
  }
}

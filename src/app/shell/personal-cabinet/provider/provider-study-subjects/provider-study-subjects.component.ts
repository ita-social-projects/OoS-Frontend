import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, EMPTY, filter, map, skip, startWith, takeUntil } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { Moment } from 'moment';

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
import { DateRangeValidator } from 'shared/validators/date-range/date-range-validator';
import { InstantErrorStateMatcher } from 'shared/validators/instant-error-matcher';
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
  public dataSource: MatTableDataSource<StudySubject> = new MatTableDataSource<StudySubject>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public subjectParameters: StudySubjectParameters = {
    providerId: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public matcher = new InstantErrorStateMatcher();
  public filterForm: FormGroup;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    super(store, matDialog);
  }

  public get datesGroup(): FormGroup {
    return this.filterForm?.get('dates') as FormGroup;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initForm();

    this.subjectParameters.providerId = this.provider.id;
    this.getStudySubjects();

    this.listenToSearchInput();
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
    this.filterForm.reset();
    this.subjectParameters.dateFrom = '';
    this.subjectParameters.dateTo = '';
    this.closeDatePicker();

    this.getStudySubjects();
  }

  public getStudySubjects(): void {
    const from = this.datesGroup?.get('dateFrom')?.value;
    const to = this.datesGroup?.get('dateTo')?.value;

    this.subjectParameters.dateFrom = from?.isValid() ? from.format('YYYY-MM-DD') : '';
    this.subjectParameters.dateTo = to?.isValid() ? to.format('YYYY-MM-DD') : '';

    Util.setFromPaginationParam(this.subjectParameters, this.currentPage, this.totalElements);

    this.store.dispatch(new GetStudySubjects(this.subjectParameters));
  }

  private initForm(): void {
    this.filterForm = new FormGroup({
      filterFormControl: new FormControl(''),
      dates: this.formBuilder.group(
        {
          dateFrom: new FormControl<Moment | null>(null),
          dateTo: new FormControl<Moment | null>(null)
        },
        { validators: DateRangeValidator('dateFrom', 'dateTo') }
      )
    });
  }

  private listenToSearchInput(): void {
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

    this.datesGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.datesGroup.valid)
      )
      .subscribe(() => {
        this.getStudySubjects();
      });
  }

  private listenToDateOnPickerOpened(): void {
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
        const from = this.datesGroup.get('dateFrom').value;
        const to = this.datesGroup.get('dateTo').value;
        if (!from || (date.isBefore(from) && !to)) {
          this.datesGroup.patchValue({ dateFrom: date });
        } else if (!to) {
          this.datesGroup.patchValue({ dateTo: date });
        } else {
          this.datesGroup.patchValue({ dateFrom: date, dateTo: null });
        }
      });
  }
}

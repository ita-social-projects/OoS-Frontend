import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PushNavPath } from 'shared/store/navigation.actions';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, distinctUntilChanged, skip, filter, map, takeUntil, startWith, debounceTime } from 'rxjs';
// eslint-disable-next-line max-len
import { ProviderState } from 'shared/store/provider.state';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Util } from 'shared/utils/utils';
import { SubjectModel, SubjectParameters } from 'shared/models/study-subject.model';
import { SearchResponse } from 'shared/models/search.model';
import { DeleteStudySubjectById, GetStudySubjects } from 'shared/store/provider.actions';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-study-subjects',
  templateUrl: './provider-study-subjects.component.html',
  styleUrls: ['./provider-study-subjects.component.scss']
})
export class ProviderStudySubjectsComponent extends ProviderComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) public sort: MatSort;

  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;
  public readonly noStudySubjects = NoResultsTitle.noStudySubjects;
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
  public dataSource: MatTableDataSource<SubjectModel> = new MatTableDataSource<SubjectModel>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public subjectParameters: SubjectParameters = {
    providerId: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public studySubjects$: Observable<SubjectModel>;
  public filterForm: FormGroup;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.filterForm = new FormGroup({
      filterFormControl: new FormControl(''),
      dateFrom: new FormControl(''),
      dateTo: new FormControl('')
    });

    this.filterForm
      .get('filterFormControl')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$),
        map((searchedText: string) => searchedText.trim())
      )
      .subscribe((searchedText: string) => {
        this.subjectParameters.searchString = searchedText;

        this.currentPage = PaginationConstants.firstPage;
        this.getStudySubjects();
      });
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
      .pipe(
        filter((subject: SearchResponse<SubjectModel[]>) => Boolean(subject)),
        takeUntil(this.destroy$)
      )
      .subscribe((subjects: SearchResponse<SubjectModel[]>) => {
        this.dataSource.data = subjects.entities;
        this.totalElements = subjects.totalAmount;
        this.isLoaded = true;
      });
    this.dataSource.sort = this.sort;
  }

  public onDelete(subject: SubjectModel): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: { type: ModalConfirmationType.deleteSubject, property: subject.nameInUkrainian }
    });
    dialogRef
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

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getStudySubjects(): void {
    this.subjectParameters.providerId = this.provider.id;
    Util.setFromPaginationParam(this.subjectParameters, this.currentPage, this.totalElements);
    this.store.dispatch(new GetStudySubjects(this.subjectParameters));
  }
}

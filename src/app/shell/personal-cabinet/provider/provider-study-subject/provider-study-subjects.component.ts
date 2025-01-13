import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store, ofAction } from '@ngxs/store';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { PushNavPath } from 'shared/store/navigation.actions';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, distinctUntilChanged, filter, map, takeUntil, BehaviorSubject } from 'rxjs';
import { Direction } from 'shared/models/category.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { SetDirections } from 'shared/store/filter.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
// eslint-disable-next-line max-len
import { ProviderState } from 'shared/store/provider.state';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { Util } from 'shared/utils/utils';
import { SubjectModel } from 'shared/models/study-subject.model';
import { ProviderComponent } from '../provider.component';
import { CreateStudySubjectComponent } from '../create-study-subject/create-study-subject.component';

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
  public columns: string[];
  public displayedColumns: string[] = [
    'subj-name',
    'creation-date',
    'last-referred',
    'used-in',
    'teaching-lang-subj-name',
    'teaching-lang',
    'actions'
  ];
  public isLoaded: boolean = false;
  public dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);
  public dummyData: object[];

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions,
    private router: Router,
    private subjectService: StudySubjectService
  ) {
    super(store, matDialog);
  }

  /**
   * This method sets the navigation path
   */
  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Subjects,
        isActive: false,
        disable: true
      })
    );
  }

  /**
   * This method should get provider subjects according to the subrole
   */
  public initProviderData(): void {
    this.subjectService
      .getSubjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((subjects: SubjectModel[]) => {
        this.dataSource = new MatTableDataSource(subjects);
        this.isLoaded = true;
      });
  }

  /**
   *   this method should load data about subjects
   */
  private getProvider(): void {}

  public onDelete(subject: SubjectModel): void {
    this.subjectService.deleteSubject(subject);
  }
}

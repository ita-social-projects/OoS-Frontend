import {
  ChildDeclination,
  WorkshopDeclination
} from '../../../../shared/enum/enumUA/declinations/declination';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { takeUntil, filter } from 'rxjs/operators';
import {
  Application,
  ApplicationParameters
} from '../../../../shared/models/application.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnUpdateApplicationSuccess } from '../../../../shared/store/shared-user.actions';
import { Observable, Subject } from 'rxjs';
import { PaginationConstants } from '../../../../shared/constants/constants';
import {
  Statuses,
  StatusTitles,
  StatusTitlesReverse
} from '../../../../shared/enum/statuses';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { Child } from '../../../../shared/models/child.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import {
  OnPageChangeApplications,
  SetApplicationsPerPage
} from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { SharedUserState } from '../../../../shared/store/shared-user.state';
import { SearchResponse } from '../../../../shared/models/search.model';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly statusTitles = StatusTitles;
  readonly statuses = Statuses;
  readonly noApplicationTitle = NoResultsTitle.noApplication;
  readonly Role = Role;

  @Select(SharedUserState.applications)
  applicationCards$: Observable<SearchResponse<Application[]>>;
  @Select(PaginatorState.applicationsPerPage)
  applicationsPerPage$: Observable<number>;
  applicationCards: SearchResponse<Application[]>;
  @Select(SharedUserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Input() applicationParams: ApplicationParameters;
  @Input() dropdownEntities: Child[] | Workshop[];
  @Input() declination: ChildDeclination | WorkshopDeclination;
  @Input() role: Role;

  @Output() getApplications = new EventEmitter();
  @Output() enititiesSelect = new EventEmitter();
  @Output() leave = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() block = new EventEmitter();
  @Output() unblock = new EventEmitter();

  destroy$: Subject<boolean> = new Subject<boolean>();
  isActiveInfoButton = false;
  tabIndex: number;
  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(
    protected store: Store,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions
  ) {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.tabIndex = Object.keys(StatusTitles).indexOf(params['status']);
      });
  }

  onGetApplications(): void {
    this.getApplications.emit();
  }

  onEntitiesSelect(IDs: string[]): void {
    this.enititiesSelect.emit(IDs);
  }

  ngAfterViewInit(): void {
    this.tabGroup.selectedIndex = this.tabIndex;
  }

  ngOnInit(): void {
    this.applicationCards$
      .pipe(
        filter(
          (applicationCards: SearchResponse<Application[]>) =>
            !!applicationCards
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (applicationCards: SearchResponse<Application[]>) =>
          (this.applicationCards = applicationCards)
      );
    this.actions$
      .pipe(ofActionCompleted(OnUpdateApplicationSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onGetApplications());
  }

  /**
   * This method get the list of application according to the selected tab
   * @param workshopsId: number[]
   */
  onTabChange(event: MatTabChangeEvent): void {
    const tabLabel = event.tab.textLabel;
    const statuses =
      tabLabel !== StatusTitles.Blocked && tabLabel !== StatusTitles.All
        ? [StatusTitlesReverse[tabLabel]]
        : [];
    this.applicationParams.statuses = statuses;
    this.applicationParams.showBlocked = tabLabel === StatusTitles.Blocked;
    this.onGetApplications();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: StatusTitlesReverse[tabLabel] }
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeApplications(page));
    this.onGetApplications();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch(new SetApplicationsPerPage(itemsPerPage));
    this.onGetApplications();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

import { Role } from 'src/app/shared/enum/role';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { takeUntil, filter } from 'rxjs/operators';
import {
  ApplicationCards,
  ApplicationParameters,
} from '../../../../shared/models/application.model';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { MatTabGroup } from '@angular/material/tabs';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { ApplicationTitles, ApplicationTitlesReverse } from 'src/app/shared/enum/enumUA/applications';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnUpdateApplicationSuccess } from '../../../../shared/store/shared-user.actions';
import { Observable, Subject } from 'rxjs';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { OnPageChangeApplications, SetApplicationsPerPage } from 'src/app/shared/store/paginator.actions';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { SharedUserState } from 'src/app/shared/store/shared-user.state';
import { Child } from 'src/app/shared/models/child.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ChildDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { PaginationConstants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly noApplicationTitle = NoResultsTitle.noApplication;
  readonly Role = Role;

  @Select(SharedUserState.applications)
  applicationCards$: Observable<ApplicationCards>;
  @Select(PaginatorState.applicationsPerPage)
  applicationsPerPage$: Observable<number>;
  applicationCards: ApplicationCards;
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
        this.tabIndex = Object.keys(ApplicationTitles).indexOf(params['status']);
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
    this.applicationCards$.pipe(
      filter((applicationCards: ApplicationCards) => !!applicationCards),
      takeUntil(this.destroy$)
    ).subscribe((applicationCards: ApplicationCards) => this.applicationCards = applicationCards);
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
    const statuses = (tabLabel !== ApplicationTitles.Blocked && tabLabel !== ApplicationTitles.All) ? [ApplicationTitlesReverse[tabLabel]] : [];
    this.applicationParams.statuses = statuses;
    this.applicationParams.showBlocked = tabLabel === ApplicationTitles.Blocked;
    this.onGetApplications();
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: { status: ApplicationTitlesReverse[tabLabel] } });
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

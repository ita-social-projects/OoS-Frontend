import { ApplicationStatuses } from './../../../../shared/enum/statuses';
import { ChildDeclination, WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { takeUntil, filter, debounceTime, take } from 'rxjs/operators';
import { Application, ApplicationFilterParameters } from '../../../../shared/models/application.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnUpdateApplicationSuccess } from '../../../../shared/store/shared-user.actions';
import { Observable, Subject } from 'rxjs';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { Child } from '../../../../shared/models/child.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { OnPageChangeApplications, SetApplicationsPerPage } from '../../../../shared/store/paginator.actions';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { SharedUserState } from '../../../../shared/store/shared-user.state';
import { SearchResponse } from '../../../../shared/models/search.model';
import { FormControl } from '@angular/forms';
import { ApplicationStatusTabParams } from '../../../../shared/enum/applications';
import { ApplicationTitles } from '../../../../shared/enum/enumUA/applications';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly applicationTabTitles = ApplicationTitles;
  readonly statusTitles = ApplicationStatusTabParams;
  readonly statuses = ApplicationStatuses;
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

  @Input() applicationParams: ApplicationFilterParameters;
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
  currentPage: PaginationElement = PaginationConstants.firstPage;
  isMobileView: boolean;
  searchFormControl: FormControl = new FormControl('');

  @HostListener('window: resize', ['$event.target'])
  onResize(event: Window): void {
    this.isMobileView = event.outerWidth < 530;
  }

  constructor(
    protected store: Store,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions
  ) {
    this.onResize(window);
  }

  onGetApplications(): void {
    this.getApplications.emit();
  }

  onEntitiesSelect(IDs: string[]): void {
    this.enititiesSelect.emit(IDs);
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((searchString: string) => {
        this.applicationParams.searchString = searchString;
        this.onGetApplications();
      });

    this.applicationCards$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((applicationCards: SearchResponse<Application[]>) => (this.applicationCards = applicationCards));

    this.actions$
      .pipe(ofActionCompleted(OnUpdateApplicationSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onGetApplications());
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      const status = params['status'];
      const tabIndex = Number(ApplicationStatusTabParams[status]);

      this.setFilterParams(status, tabIndex);
      this.tabGroup.selectedIndex = tabIndex;
      this.onGetApplications();
    });
  }

  /**
   * This method get the list of application according to the selected tab
   * @param workshopsId: number[]
   */
  onTabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: ApplicationStatusTabParams[tabIndex] },
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

  private setFilterParams(applicationStatus: string, tabIndex?: number): void {
    const statuses = ApplicationStatuses[applicationStatus] ? [ApplicationStatuses[applicationStatus]] : [];
    this.applicationParams.statuses = statuses;
    this.applicationParams.showBlocked = tabIndex === ApplicationStatusTabParams.Blocked;
  }
}

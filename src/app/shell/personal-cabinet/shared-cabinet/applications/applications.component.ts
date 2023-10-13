import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { NotificationType } from 'shared/enum/notifications';
import { GetDirections } from 'shared/store/meta-data.actions';
import { PaginationConstants } from 'shared/constants/constants';
import { ApplicationStatusTabParams } from 'shared/enum/applications';
import { ChildDeclination, WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters } from 'shared/models/application.model';
import { Child } from 'shared/models/child.model';
import { PaginationElement } from 'shared/models/paginationElement.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import { ReadUsersNotificationsByType } from 'shared/store/notifications.actions';
import { OnUpdateApplicationSuccess } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  public readonly applicationTabTitles = ApplicationTitles;
  public readonly statusTitles = ApplicationStatusTabParams;
  public readonly statuses = ApplicationStatuses;
  public readonly noApplicationTitle = NoResultsTitle.noApplication;
  public readonly Role = Role;

  @Select(SharedUserState.applications)
  private applicationCards$: Observable<SearchResponse<Application[]>>;
  public applicationCards: SearchResponse<Application[]>;
  @Select(SharedUserState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;

  @ViewChild(MatTabGroup) private tabGroup: MatTabGroup;

  @Input() public applicationParams: ApplicationFilterParameters;
  @Input() public dropdownEntities: Child[] | Workshop[];
  @Input() public declination: ChildDeclination | WorkshopDeclination;
  @Input() public role: Role;

  @Output() public getApplications = new EventEmitter();
  @Output() public enititiesSelect = new EventEmitter();
  @Output() public leave = new EventEmitter();
  @Output() public approve = new EventEmitter();
  @Output() public acceptForSelection = new EventEmitter();
  @Output() public reject = new EventEmitter();
  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();
  @Output() public sendMessage = new EventEmitter();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public isActiveInfoButton = false;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public isMobileView: boolean;
  public searchFormControl: FormControl = new FormControl('');

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isMobileView = event.outerWidth < 530;
  }

  constructor(protected store: Store, protected router: Router, protected route: ActivatedRoute, protected actions$: Actions) {
    this.onResize(window);
  }

  public onEntitiesSelect(IDs: string[]): void {
    this.currentPage = PaginationConstants.firstPage;
    Util.setFromPaginationParam(this.applicationParams, this.currentPage, this.applicationCards?.totalAmount);
    this.enititiesSelect.emit(IDs);
  }

  public ngOnInit(): void {
    this.store.dispatch(new ReadUsersNotificationsByType(NotificationType.Application, true));
    this.store.dispatch(new GetDirections());

    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((searchString: string) => {
      this.applicationParams.searchString = searchString;
      this.currentPage = PaginationConstants.firstPage;
      this.getApplicationData();
    });

    this.applicationCards$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((applicationCards: SearchResponse<Application[]>) => (this.applicationCards = applicationCards));

    this.actions$
      .pipe(ofActionCompleted(OnUpdateApplicationSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getApplications.emit());
  }

  public ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(100)).subscribe((params: Params) => {
      const status = params['status'];
      const tabIndex = Number(ApplicationStatusTabParams[status]);
      this.setFilterParams(status, tabIndex);
      this.tabGroup.selectedIndex = tabIndex;
      this.currentPage = PaginationConstants.firstPage;
      this.getApplicationData();
    });
  }

  /**
   * This method get the list of application according to the selected tab
   * @param workshopsId: number[]
   */
  public onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: ApplicationStatusTabParams[event.index] }
    });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getApplicationData();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.applicationParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setFilterParams(applicationStatus: string, tabIndex?: number): void {
    const statuses = ApplicationStatuses[applicationStatus] ? [ApplicationStatuses[applicationStatus]] : [];
    this.applicationParams.statuses = statuses;
    this.applicationParams.showBlocked = tabIndex === ApplicationStatusTabParams.Blocked;
  }

  private getApplicationData(): void {
    Util.setFromPaginationParam(this.applicationParams, this.currentPage, this.applicationCards?.totalAmount);
    this.getApplications.emit();
  }
}

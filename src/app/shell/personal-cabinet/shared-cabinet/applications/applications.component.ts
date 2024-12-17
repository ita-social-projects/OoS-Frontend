import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actions, Select, Store, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { ApplicationShowParams, ApplicationStatusTabParams } from 'shared/enum/applications';
import { ChildDeclination, WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { NotificationType } from 'shared/enum/notifications';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters } from 'shared/models/application.model';
import { Child } from 'shared/models/child.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import { GetDirections } from 'shared/store/meta-data.actions';
import { ReadUsersNotificationsByType } from 'shared/store/notification.actions';
import { OnUpdateApplicationSuccess } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { Util } from 'shared/utils/utils';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { isRoleProvider } from 'shared/utils/provider.utils';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public applicationParams: ApplicationFilterParameters;
  @Input() public dropdownEntities: Child[] | Workshop[];
  @Input() public declination: ChildDeclination | WorkshopDeclination;
  @Input() public role: Role;

  @Output() public getApplications = new EventEmitter();
  @Output() public entitiesSelect = new EventEmitter();
  @Output() public leave = new EventEmitter();
  @Output() public approve = new EventEmitter();
  @Output() public acceptForSelection = new EventEmitter();
  @Output() public reject = new EventEmitter();
  @Output() public block = new EventEmitter();
  @Output() public unblock = new EventEmitter();
  @Output() public sendMessage = new EventEmitter();

  @Select(SharedUserState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(SharedUserState.applications)
  private applicationCards$: Observable<SearchResponse<Application[]>>;

  @ViewChild(MatTabGroup) private tabGroup: MatTabGroup;

  public readonly ApplicationTitles = ApplicationTitles;
  public readonly ApplicationStatuses = ApplicationStatuses;
  public readonly NoApplicationTitle = NoResultsTitle.noApplication;
  public readonly Role = Role;
  public readonly InfoMenuType = InfoMenuType;
  public readonly isRoleProvider = isRoleProvider;

  public applicationCards: SearchResponse<Application[]>;
  public isActiveInfoButton = false;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public isMobileView: boolean;
  public searchFormControl: FormControl = new FormControl('');

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected store: Store,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions
  ) {
    this.onResize(window);
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isMobileView = event.outerWidth < 530;
  }

  public onEntitiesSelect(IDs: string[]): void {
    this.currentPage = PaginationConstants.firstPage;
    Util.setFromPaginationParam(this.applicationParams, this.currentPage, this.applicationCards?.totalAmount);
    this.entitiesSelect.emit(IDs);
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
      const status = params.status;
      const tabIndex = Number(ApplicationStatusTabParams[status]);
      this.setFilterParams(status, tabIndex);
      this.tabGroup.selectedIndex = tabIndex;
      this.currentPage = PaginationConstants.firstPage;
      this.getApplicationData();
    });
  }

  /**
   * This method get the list of application according to the selected tab
   * @param event
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
    this.applicationParams.statuses = ApplicationStatuses[applicationStatus] ? [ApplicationStatuses[applicationStatus]] : [];
    if (this.role !== Role.parent && (!applicationStatus || tabIndex === ApplicationStatusTabParams.All)) {
      this.applicationParams.show = ApplicationShowParams.All;
    } else {
      this.applicationParams.show =
        tabIndex === ApplicationStatusTabParams.Blocked ? ApplicationShowParams.Blocked : ApplicationShowParams.Unblocked;
    }
  }

  private getApplicationData(): void {
    Util.setFromPaginationParam(this.applicationParams, this.currentPage, this.applicationCards?.totalAmount);
    this.getApplications.emit();
  }
}

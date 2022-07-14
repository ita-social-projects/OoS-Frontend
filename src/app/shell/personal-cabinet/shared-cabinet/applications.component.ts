import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { debounceTime, mergeMap, takeUntil, filter } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { Role } from 'src/app/shared/enum/role';
import { Child } from 'src/app/shared/models/child.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import {
  Application,
  ApplicationCards,
  ApplicationParameters,
  ApplicationUpdate,
} from '../../../shared/models/application.model';
import { UpdateApplication } from 'src/app/shared/store/user.actions';
import { CabinetDataComponent } from './cabinet-data.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { MatTabGroup } from '@angular/material/tabs';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { ApplicationTitles, ApplicationTitlesReverse } from 'src/app/shared/enum/enumUA/applications';
import { Constants } from 'src/app/shared/constants/constants';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnUpdateApplicationSuccess } from '../../../shared/store/user.actions';
import { ChildDeclination, WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { Observable } from 'rxjs';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { OnPageChangeApplications, SetApplicationsPerPage } from 'src/app/shared/store/paginator.actions';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-applications',
  template: '',
})
export abstract class ApplicationsComponent extends CabinetDataComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly noApplicationTitle = NoResultsTitle.noApplication;

  @Select(UserState.applications)
  applicationCards$: Observable<ApplicationCards>;
  @Select(PaginatorState.applicationsPerPage)
  applicationsPerPage$: Observable<number>;
  applicationCards: ApplicationCards;

  isActiveInfoButton = false;
  tabIndex: number;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true,
  };

  protected applicationParams: ApplicationParameters = {
    property: null,
    statuses: [],
    workshops:[],
    showBlocked: false,
  };

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions
  ) {
    super(store, matDialog);
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => (this.tabIndex = Object.keys(ApplicationTitles).indexOf(params['status'])));
  }

  protected abstract getApplications(statuses?: ApplicationStatus[]): void;

  abstract onEntitiesSelect(IDs: string[]): void;

  ngAfterViewInit(): void {
    this.tabGroup.selectedIndex = this.tabIndex;
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Applications,
        isActive: false,
        disable: true,
      })
    );
  }

  protected init(): void {
    this.applicationCards$.pipe(
      filter((applicationCards: ApplicationCards) => !!applicationCards),
      takeUntil(this.destroy$)
    ).subscribe((applicationCards: ApplicationCards) => this.applicationCards = applicationCards);
    this.actions$
      .pipe(ofActionCompleted(OnUpdateApplicationSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getApplications());
  }

  /**
   * This method changes status of emitted event to "left"
   * @param Application event
   */
  onLeave(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.Left);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method get the list of application according to the selected tab
   * @param workshopsId: number[]
   */
  onTabChange(event: MatTabChangeEvent): void {
    const tabLabel = event.tab.textLabel;
    const statuses = (tabLabel !== ApplicationTitles.Blocked && tabLabel !== ApplicationTitles.All) ? [ApplicationTitlesReverse[tabLabel]] : [];
    this.applicationParams.statuses = statuses;
    this.getApplications();
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: { status: tabLabel } });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeApplications(page));
    this.getApplications();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch(new SetApplicationsPerPage(itemsPerPage));
    this.getApplications();
  }
}

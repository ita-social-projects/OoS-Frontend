import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { Role } from 'src/app/shared/enum/role';
import { Child } from 'src/app/shared/models/child.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import { Application, ApplicationUpdate } from '../../../shared/models/application.model';
import { UpdateApplication } from 'src/app/shared/store/user.actions';
import { ApplicationCards } from '../../../shared/models/application.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';
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


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent extends CabinetDataComponent implements OnInit, AfterViewInit, OnDestroy {

  @Select(PaginatorState.applicationsPerPage)
  applicationsPerPage$: Observable<number>;

  readonly noApplicationTitle = NoResultsTitle.noApplication;
  readonly constants: typeof Constants = Constants;
  applicationCards: ApplicationCards;
  isActiveInfoButton = false;
  tabIndex: number;
  applicationParams: {
    status: string,
    showBlocked: boolean,
    workshopsId: string[],
  } = {
      status: undefined,
      showBlocked: false,
      workshopsId: []
    };
  isSelectedChildCheckbox = false;
  ChildDeclination = ChildDeclination;
  WorkshopDeclination = WorkshopDeclination;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;

  @ViewChild(MatTabGroup)
  tabGroup: MatTabGroup;

  constructor(
    private infoBoxService: InfoBoxService,
    private router: Router,
    private route: ActivatedRoute,
    store: Store,
    matDialog: MatDialog,
    actions$: Actions,
    navigationBarService: NavigationBarService,
) {
    super(store, matDialog, actions$, navigationBarService);
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => this.tabIndex = Object.keys(ApplicationTitles).indexOf(params['status']));
  }

  ngAfterViewInit(): void {
    this.tabGroup.selectedIndex = this.tabIndex;
    this.store.dispatch(
      new PushNavPath(
        {
          name: NavBarName.Applications,
          isActive: false,
          disable: true,
        }
      )
    );
  }

  ngOnInit(): void {
    this.getUserData();
    this.actions$.pipe(ofActionCompleted(OnUpdateApplicationSuccess))
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.role === Role.provider) {
          this.getProviderApplications(this.applicationParams);
        } else {
          this.getParentApplications(this.applicationParams);
        }
      });
  }

  init(): void {
    if (this.role === Role.provider) {
      this.getProviderApplications(this.applicationParams);
      this.getProviderWorkshops();
      this.activateChildInfoBox();
    } else {
      this.getAllUsersChildren();
      this.getParentApplications(this.applicationParams);
    }
  }

  /**
   * This method initialize functionality to open child-info-box
   */
  private activateChildInfoBox(): void {
    const viewContainerRef = this.infoBoxHost.viewContainerRef;

    this.infoBoxService.isMouseOver$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        mergeMap(isMouseOver =>
          this.infoBoxService.loadComponent(viewContainerRef, isMouseOver)
        )
      )
      .subscribe();
  }

  /**
   * This method changes status of emitted event to "approved"
   * @param Application event
   */
  onApprove(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.Approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "rejected"
   * @param Application event
   */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.Rejected, application?.rejectionMessage);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
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
    const tabLabel = ApplicationTitlesReverse[event.tab.textLabel];
    const status = (tabLabel !==  ApplicationTitlesReverse[ApplicationTitles.Blocked] && tabLabel !==  ApplicationTitlesReverse[ApplicationTitles.All]) ?
    tabLabel : null;
    this.applicationParams.status = status;
    if (this.role === Role.provider) {
      this.applicationParams.showBlocked = tabLabel === ApplicationTitlesReverse[ApplicationTitles.Blocked];
      this.getProviderApplications(this.applicationParams);
    } else {
      this.getParentApplications(this.applicationParams);
    }
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: { status: tabLabel } });
  }

  /**
 * This applies selected IDs as filtering parameter to get list of applications
 * @param IDs: string[]
 */
   onEntitiesSelect(IDs: string[]): void {
      if (this.role === Role.provider) {
        this.applicationParams.workshopsId = IDs;
        this.getProviderApplications(this.applicationParams);
      } else {
        this.isSelectedChildCheckbox = !!IDs.length;
        this.filteredChildren = this.childrenCards.filter((child: Child) => IDs.includes(child.id) || !IDs.length);
      }
  }

  /**
   * This method makes ChildInfoBox visible, pass value to the component and insert it under the position of emitted element
   * @param object : { element: Element, child: Child }
   */
  onInfoShow({ element, child }: { element: Element, child: Child }): void {
    this.infoBoxService.onMouseOver({ element, child });
  }

  onInfoHide(): void {
    this.infoBoxService.onMouseLeave();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeApplications(page));
    if (this.role === Role.provider) {
      this.getProviderApplications(this.applicationParams);
    } else {
      this.getParentApplications(this.applicationParams);
    }
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch(new SetApplicationsPerPage(itemsPerPage));
    if (this.role === Role.provider) {
      this.getProviderApplications(this.applicationParams);
    } else {
      this.getParentApplications(this.applicationParams);
    }
  }
}

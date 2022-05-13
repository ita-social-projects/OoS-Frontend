
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Store } from '@ngxs/store';
import { debounceTime, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { Role } from 'src/app/shared/enum/role';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import { UpdateApplication } from 'src/app/shared/store/user.actions';
import { Application, ApplicationUpdate } from '../../../shared/models/application.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { ApplicationTitles, ApplicationTitlesReverse } from 'src/app/shared/enum/enumUA/applications';
import { Constants } from 'src/app/shared/constants/constants';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnUpdateApplicationSuccess } from '../../../shared/store/user.actions';
import { ChildDeclination, WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent extends CabinetDataComponent implements OnInit {

  readonly noApplicationTitle = NoResultsTitle.noApplication;
  readonly constants: typeof Constants = Constants;

  isActiveInfoButton = false;
  tabIndex: number;
  providerApplicationParams: {
    status: string,
    workshopsId: string[]
  } = {
      status: undefined,
      workshopsId: []
    };
  isSelectedChildCheckbox = false;
  ChildDeclination = ChildDeclination;
  WorkshopDeclination = WorkshopDeclination;

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;

  constructor(
    store: Store,
    private infoBoxService: InfoBoxService,
    matDialog: MatDialog,
    actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,) {
    super(store, matDialog, actions$);
  }

  ngOnInit(): void {
    this.getUserData();
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => this.tabIndex = Object.keys(ApplicationTitles).indexOf(params.param));

    this.actions$.pipe(ofAction(OnUpdateApplicationSuccess))
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.role === Role.provider) {
          this.getProviderApplications(this.providerApplicationParams);
        } else {
          this.getParentApplications();
        }
      });
  }

  init(): void {
    if (this.role === Role.provider) {
      this.getProviderApplications(this.providerApplicationParams);
      this.getProviderWorkshops();
      this.activateChildInfoBox();
    } else {
      this.getAllUsersChildren();
      this.getParentApplications();
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
    if (this.role === Role.provider) {
      this.providerApplicationParams.status = (tabLabel !== ApplicationTitlesReverse[ApplicationTitles.All]) ?
      tabLabel : null;
      this.getProviderApplications(this.providerApplicationParams);
      this.router.navigate(['../', tabLabel], { relativeTo: this.route });
    } else {
      this.getParentApplications();
    }

  }

  /**
 * This applies selected IDs as filtering parameter to get list of applications
 * @param IDs: string[]
 */
   onEntitiesSelect(IDs: string[]): void {
      if (this.role === Role.provider) {
        this.providerApplicationParams.workshopsId = IDs;
        this.getProviderApplications(this.providerApplicationParams);
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
}

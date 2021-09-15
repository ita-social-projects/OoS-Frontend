
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Store } from '@ngxs/store';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { Role } from 'src/app/shared/enum/role';
import { Child } from 'src/app/shared/models/child.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import { UpdateApplication } from 'src/app/shared/store/user.actions';
import { Application, ApplicationUpdate } from '../../../shared/models/application.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent extends CabinetDataComponent implements OnInit {

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;
  tabApplicationStatus: number;
  isActiveInfoButton: boolean = false;


  providerApplicationParams: {
    status: number,
    workshopsId: number[]
  } = {
      status: undefined,
      workshopsId: []
    };

  constructor(store: Store,
    private infoBoxService: InfoBoxService,
    matDialog: MatDialog,
    private actions$: Actions) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    this.getUserData();

    this.actions$.pipe(ofAction(UpdateApplication))
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.userRole === Role.provider) {
          this.getProviderApplications(this.providerApplicationParams);
        } else {
          this.getParenApplications();
        }
      });
  }

  init(): void {
    if (this.userRole === Role.provider) {
      this.getProviderApplications(this.providerApplicationParams);
      this.getProviderWorkshops();
      this.activateChildInfoBox();
    } else {
      this.getParenChildren();
      this.getParenApplications();
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
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.Rejected);
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
  * This gte the lost of application according to teh selected tab
  * @param workshopsId: number[]
  */
  onTabChange(event: MatTabChangeEvent): void {
    this.tabApplicationStatus = this.applicationTitles[event.tab.textLabel];
    this.providerApplicationParams.status = this.tabApplicationStatus;
    this.getProviderApplications(this.providerApplicationParams);
  }

  /**
  * This applies selected workshops as filtering parameter to get list of applications
  * @param workshopsId: number[]
  */
  onWorkshopsSelect(workshopsId: number[]): void {
    this.providerApplicationParams.workshopsId = workshopsId;
    this.getProviderApplications(this.providerApplicationParams);
  }

  /**
  * This method makes ChildInfoBox visible, pass value to the component and insert it under the position of emitted element
  * @param { element: Element, child: Child } object
  */
  onInfoShow({ element, child }: { element: Element, child: Child }): void {
    this.infoBoxService.onMouseOver({ element, child });
  }

  onInfoHide(): void {
    this.infoBoxService.onMouseLeave();
  }
 

}

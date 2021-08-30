import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { ApplicationStatus, ApplicationStatusUkr } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId, GetChildrenByParentId, GetWorkshopsByProviderId, UpdateApplication } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Application, ApplicationUpdate } from '../../../shared/models/application.model';
import { CabinetDataComponent } from '../cabinet-data/cabinet-data.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent extends CabinetDataComponent implements OnInit {

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;

  constructor(store: Store,
    private infoBoxService: InfoBoxService,
    matDialog: MatDialog) {
    super(store, matDialog);
  }

  ngOnInit(): void {
    this.getUserData();
  }

  init(): void {
    if (this.userRole === Role.provider) {
      this.getProviderWorkshops();
      this.getProviderApplications();
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
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
  * This method changes status of emitted event to "rejected"
  * @param Application event
  */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.rejected);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
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

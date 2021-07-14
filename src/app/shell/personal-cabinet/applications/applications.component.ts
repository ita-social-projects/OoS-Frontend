import { Component, OnInit, ViewChild } from '@angular/core';
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
import { GetWorkshops } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId, GetChildrenByParentId, GetWorkshopsByParentId, GetWorkshopsByProviderId, UpdateApplication } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Application, ApplicationUpdate } from '../../../shared/models/application.model';
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  readonly applicationStatusUkr = ApplicationStatusUkr;
  readonly applicationStatus = ApplicationStatus;
  readonly role = Role;

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  @Select(UserState.children)
  children$: Observable<Child[]>;

  workshopList: Workshop[];
  user: User;

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store,
    private infoBoxService: InfoBoxService) { }

  ngOnInit(): void {
    this.user = this.store.selectSnapshot<User>(RegistrationState.user);
    this.getApplication();
  }

  /**
  * This method initialize functionality to open child-info-box
  */
  activateChildInfoBox(): void {
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
    this.getApplication();
  }

  /**
  * This method changes status of emitted event to "rejected"
  * @param Application event
  */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.rejected);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
    this.getApplication();
  }

  /**
  * This method get data according to teh user roles
  */
  getApplication(): void {

    if (this.user.role === Role.parent) {
      const parent = this.store.selectSnapshot<Parent>(RegistrationState.parent);
      this.store.dispatch(new GetChildrenByParentId(parent.id));
      this.store.dispatch(new GetApplicationsByParentId(parent.id));
      this.store.dispatch(new GetWorkshopsByParentId()); //TODO: add parent id

    } else {
      const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
      this.store.dispatch(new GetWorkshopsByProviderId(provider.id));
      this.store.dispatch(new GetApplicationsByProviderId(provider.id));
      this.activateChildInfoBox();
    }
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

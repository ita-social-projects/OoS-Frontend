import { Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { InfoBoxHostDirective } from 'src/app/shared/directives/info-box-host.directive';
import { Child } from 'src/app/shared/models/child.model';
import { User } from 'src/app/shared/models/user.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsById } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { Application } from '../../../shared/models/application.model';


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  public applications: Application[];
  child: Child;
  role ;                                                                                                                                                 
  
  

  @ViewChild(InfoBoxHostDirective, { static: true })
  infoBoxHost: InfoBoxHostDirective;
  destroy$: Subject<boolean> = new Subject<boolean>();
 

  constructor(private store: Store,
    private infoBoxService: InfoBoxService) { }

  ngOnInit(): void {
    this.store.dispatch(new GetApplicationsById(null));
    this.applications$.subscribe(applications =>
      this.applications = applications
    );
    this.role = (this.store.selectSnapshot<User>(RegistrationState.user)).role ;
  

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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  /**
  * This method changes status of emitted event to "approved"
  * @param Application event
  */
  onApprove(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'approved';
  }

  /**
  * This method changes status of emitted event to "denied"
  * @param Application event
  */
  onDeny(event: Application): void {
    const application = this.applications.find((application) => (application === event))
    application.status = 'denied';
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

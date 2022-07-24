import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ChildDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Application, ApplicationParameters, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { ChildCards } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UpdateApplication } from 'src/app/shared/store/shared-user.actions';
import { GetAllUsersChildren, GetApplicationsByParentId} from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html',
})
export class ParentApplicationsComponent extends CabinetDataComponent  implements OnInit, OnDestroy {
  readonly ChildDeclination = ChildDeclination;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;
  @Select(UserState.children)
  childrenCards$: Observable<ChildCards>;

  applicationParams: ApplicationParameters = {
    property: null,
    statuses: [],
    workshops:[],
    children: [],
    showBlocked: false,
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
  ) {
    super(store, matDialog);
  }

  init(): void {
    this.parent$
      .pipe(
        filter((parent: Parent) => !!parent),
        takeUntil(this.destroy$)
      )
      .subscribe((parent: Parent) => {
        this.parent = parent;
        this.onGetApplications();
        this.getParentChildren();
      });
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

  /**
   * This method changes status of emitted event to "left"
   * @param Application event
   */
  onLeave(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, ApplicationStatus.Left);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  onGetApplications(): void {
    this.store.dispatch(new GetApplicationsByParentId(this.parent.id, this.applicationParams));
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs: string[]
   */
  onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.children = IDs;
    this.onGetApplications();
  }

  private getParentChildren(): void {
    this.store.dispatch(new GetAllUsersChildren());
  }
}

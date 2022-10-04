import { ParentState } from './../../../../shared/store/parent.state.';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from '../../../../shared/enum/applications';
import { ChildDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { ApplicationParameters, Application, ApplicationUpdate } from '../../../../shared/models/application.model';
import { ChildCards } from '../../../../shared/models/child.model';
import { Parent } from '../../../../shared/models/parent.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { GetAllUsersChildren } from '../../../../shared/store/parent.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { UpdateApplication, GetApplicationsByParentId } from '../../../../shared/store/shared-user.actions';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html',
})
export class ParentApplicationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly ChildDeclination = ChildDeclination;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;
  @Select(ParentState.children)
  childrenCards$: Observable<ChildCards>;

  applicationParams: ApplicationParameters = {
    property: null,
    statuses: [],
    workshops: [],
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

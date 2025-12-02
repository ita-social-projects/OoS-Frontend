import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { ApplicationEntityType, ApplicationShowParams } from 'shared/enum/applications';
import { ChildDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters, ApplicationUpdate } from 'shared/models/application.model';
import { TruncatedItem } from 'shared/models/item.model';
import { Parent } from 'shared/models/parent.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { GetAllUsersChildrenByParentId } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';
import { GetApplicationsByPropertyId, UpdateApplication } from 'shared/store/shared-user.actions';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html'
})
export class ParentApplicationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.parent)
  public parent$: Observable<Parent>;
  @Select(ParentState.truncatedItems)
  public truncatedItems$: Observable<TruncatedItem[]>;

  public readonly ChildDeclination = ChildDeclination;

  public parent: Parent;

  public applicationParams: ApplicationFilterParameters = {
    property: ApplicationEntityType.parent,
    statuses: [],
    workshops: [],
    children: [],
    show: ApplicationShowParams.Unblocked,
    size: PaginationConstants.APPLICATIONS_PER_PAGE,
    from: 0
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router
  ) {
    super(store, matDialog);
  }

  public init(): void {
    this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((parent: Parent) => {
      this.parent = parent;
      this.getParentChildren();
    });
  }

  /**
   * This method changes status of emitted event to "left"
   * @param application: Application
   */
  public onLeave(application: Application): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.leaveWorkshop
      }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application, ApplicationStatuses.Left);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }

  public onGetApplications(): void {
    this.store.dispatch(new GetApplicationsByPropertyId(this.parent.id, this.applicationParams));
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs: string[]
   */
  public onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.children = IDs;
    this.onGetApplications();
  }

  public onSendMessage(application: Application): void {
    this.router.navigate(['/personal-cabinet/messages/', application.id], {
      queryParams: { mode: ModeConstants.APPLICATION },
      replaceUrl: false
    });
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Applications,
        isActive: false,
        disable: true
      })
    );
  }

  private getParentChildren(isParent: boolean = false): void {
    this.store.dispatch(new GetAllUsersChildrenByParentId({ id: this.parent.id, isParent }));
  }
}

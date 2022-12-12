import { ParentState } from './../../../../shared/store/parent.state.';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChildDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import {
  ApplicationFilterParameters,
  Application,
  ApplicationUpdate,
} from '../../../../shared/models/application.model';
import { Parent } from '../../../../shared/models/parent.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { UpdateApplication, GetApplicationsByPropertyId } from '../../../../shared/store/shared-user.actions';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { Statuses } from '../../../../shared/enum/statuses';
import { TruncatedItem } from '../../../../shared/models/truncated.model';
import { GetAllUsersChildrenByParentId } from '../../../../shared/store/parent.actions';
import { ApplicationEntityType } from '../../../../shared/enum/applications';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';

@Component({
  selector: 'app-parent-applications',
  templateUrl: './parent-applications.component.html',
})
export class ParentApplicationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly ChildDeclination = ChildDeclination;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;
  @Select(ParentState.truncatedItems)
  truncatedItems$: Observable<TruncatedItem[]>;

  applicationParams: ApplicationFilterParameters = {
    property: ApplicationEntityType.parent,
    statuses: [],
    workshops: [],
    children: [],
    showBlocked: false,
  };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  init(): void {
    this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((parent: Parent) => {
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
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.leaveWorkshop,
      },
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application, Statuses.Left);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }

  onGetApplications(): void {
    this.store.dispatch(new GetApplicationsByPropertyId(this.parent.id, this.applicationParams));
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs: string[]
   */
  onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.children = IDs;
    this.onGetApplications();
  }

  private getParentChildren(isParent: boolean = false): void {
    this.store.dispatch(new GetAllUsersChildrenByParentId({ id: this.parent.id, isParent }));
  }
}

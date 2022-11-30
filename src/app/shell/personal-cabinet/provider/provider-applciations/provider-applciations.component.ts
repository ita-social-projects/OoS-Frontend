import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { takeUntil, filter } from 'rxjs/operators';
import { Provider } from '../../../../shared/models/provider.model';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { Statuses } from '../../../../shared/enum/statuses';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { EntityType, Role } from '../../../../shared/enum/role';
import { ApplicationParameters, Application, ApplicationUpdate } from '../../../../shared/models/application.model';
import { BlockedParent } from '../../../../shared/models/block.model';
import {
  BlockParent,
  UnBlockParent,
  GetProviderAdminWorkshops,
  GetWorkshopListByProviderId
} from '../../../../shared/store/provider.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { GetApplicationsByProviderId, UpdateApplication } from '../../../../shared/store/shared-user.actions';
import { Observable } from 'rxjs';
import { TruncatedItem } from '../../../../shared/models/truncated.model';
import { ProviderState } from '../../../../shared/store/provider.state';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ReasonModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';

@Component({
  selector: 'app-provider-applciations',
  templateUrl: './provider-applciations.component.html'
})
export class ProviderApplciationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly WorkshopDeclination = WorkshopDeclination;

  @Select(ProviderState.truncated)
  workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  providerId: string;

  applicationParams: ApplicationParameters = {
    property: null,
    statuses: [],
    workshops: [],
    children: [],
    showBlocked: false
  };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
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

  init(): void {
    this.provider$
      .pipe(
        filter((provider: Provider) => !!provider),
        takeUntil(this.destroy$)
      )
      .subscribe((provider: Provider) => {
        this.applicationParams.property = EntityType[this.subRole];
        this.providerId = this.subRole === Role.ProviderAdmin ? this.store.selectSnapshot(RegistrationState.user).id : provider.id;
        this.getProviderWorkshops();
        this.onGetApplications();
      });
  }

  onGetApplications(): void {
    this.store.dispatch(new GetApplicationsByProviderId(this.providerId, this.applicationParams));
  }

  /**
   * This method changes status of emitted event to "approved"
   * @param Application event
   */
  onApprove(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, Statuses.Approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "rejected"
   * @param Application event
   */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, Statuses.Rejected, application?.rejectionMessage);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method emit block Application
   * @param Application application
   */
  onBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.blockParent }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
        const blockedParent = new BlockedParent(parentId, providerId, result);
        this.store.dispatch(new BlockParent(blockedParent, EntityType[this.subRole]));
      }
    });
  }

  /**
   * This method emit unblock Application
   * @param Application application
   */
  onUnBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.unBlockParent
      }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
        const blockedParent = new BlockedParent(parentId, providerId);
        this.store.dispatch(new UnBlockParent(blockedParent, EntityType[this.subRole]));
      }
    });
  }

  private getProviderWorkshops(): void {
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops());
    }
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs: string[]
   */
  onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.workshops = IDs;
    this.onGetApplications();
  }
}

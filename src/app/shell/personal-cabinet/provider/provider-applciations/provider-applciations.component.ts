import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { takeUntil, filter } from 'rxjs/operators';
import { Application, ApplicationParameters, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Observable } from 'rxjs';
import {
  GetApplicationsByProviderId,
  GetWorkshopsByProviderId,
  UpdateApplication,
} from 'src/app/shared/store/shared-user.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { EntityType, Role } from 'src/app/shared/enum/role';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { BlockParent, GetProviderAdminWorkshops, GetWorkshopListByProviderId, UnBlockParent } from 'src/app/shared/store/provider.actions';
import { ReasonModalWindowComponent } from '../../shared-cabinet/applications/reason-modal-window/reason-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { BlockedParent } from 'src/app/shared/models/block.model';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { TruncatedItem } from 'src/app/shared/models/truncated.model';
import { ProviderState } from 'src/app/shared/store/provider.state';

@Component({
  selector: 'app-provider-applciations',
  templateUrl: './provider-applciations.component.html',
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
    showBlocked: false,
  };

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
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

  init(): void {
    this.provider$
      .pipe(
        filter((provider: Provider) => !!provider),
        takeUntil(this.destroy$)
      )
      .subscribe((provider: Provider) => {
        this.applicationParams.property = EntityType[this.subRole];
        this.providerId =
          this.subRole === Role.ProviderAdmin ? this.store.selectSnapshot(RegistrationState.user).id : provider.id;
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
    const applicationUpdate = new ApplicationUpdate(application.id, ApplicationStatus.Approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "rejected"
   * @param Application event
   */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(
      application.id,
      ApplicationStatus.Rejected,
      application?.rejectionMessage
    );
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method emit block Application
   * @param Application application
   */
  onBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.blockParent },
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
        type: ModalConfirmationType.unBlockParent,
      },
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

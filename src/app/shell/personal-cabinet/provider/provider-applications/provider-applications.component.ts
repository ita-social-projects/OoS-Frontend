import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, Select, Store, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { ApplicationEntityType, ApplicationShowParams } from 'shared/enum/applications';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters, ApplicationUpdate } from 'shared/models/application.model';
import { BlockedParent } from 'shared/models/block.model';
import { TruncatedItem } from 'shared/models/item.model';
import { Provider } from 'shared/models/provider.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { BlockParent, GetWorkshopListByEmployeeId, GetWorkshopListByProviderId, UnBlockParent } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { GetApplicationsByPropertyId, UpdateApplication } from 'shared/store/shared-user.actions';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';

@Component({
  selector: 'app-provider-applications',
  templateUrl: './provider-applications.component.html'
})
export class ProviderApplicationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(ProviderState.truncated)
  public workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;

  public readonly WorkshopDeclination = WorkshopDeclination;

  public provider: Provider;

  public applicationParams: ApplicationFilterParameters = {
    property: null,
    statuses: [],
    show: ApplicationShowParams.All,
    workshops: [],
    children: [],
    size: PaginationConstants.APPLICATIONS_PER_PAGE,
    from: 0
  };

  private providerId: string;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    protected router: Router,
    private actions$: Actions
  ) {
    super(store, matDialog);
  }

  /**
   * This method changes status of emitted event to "approved"
   * @param application event
   */
  public onApprove(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application, ApplicationStatuses.Approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "accepted for selection"
   * @param application event
   */
  public onAcceptForSelection(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application, ApplicationStatuses.AcceptedForSelection);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "rejected"
   * @param application event
   */
  public onReject(application: Application): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.rejectApplication }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const applicationUpdate = new ApplicationUpdate(application, ApplicationStatuses.Rejected, result);
        this.store.dispatch(new UpdateApplication(applicationUpdate));
      }
    });
  }

  /**
   * This method emit block parent
   * @param parentId
   */
  public onBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.blockParent }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const providerId = this.store.selectSnapshot<Provider>(RegistrationState.provider).id;
        const blockedParent = new BlockedParent(parentId, providerId, result);
        this.store.dispatch(new BlockParent(blockedParent));
      }
    });
  }

  /**
   * This method emit unblock parent
   * @param parentId
   */
  public onUnBlock(parentId: string): void {
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
        this.store.dispatch(new UnBlockParent(blockedParent));
      }
    });
  }

  public onSendMessage(application: Application): void {
    this.router.navigate(['/personal-cabinet/messages/', application.id], {
      queryParams: { mode: ModeConstants.APPLICATION },
      replaceUrl: false
    });
  }

  /**
   * This applies selected IDs as filtering parameter to get list of applications
   * @param IDs
   */
  public onEntitiesSelect(IDs: string[]): void {
    this.applicationParams.workshops = IDs;
    this.onGetApplications();
  }

  protected init(): void {
    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => {
      this.provider = provider;
      switch (this.role) {
        case Role.provider:
          this.applicationParams.property = ApplicationEntityType.provider;
          this.providerId = provider.id;
          break;
        case Role.providerDeputy:
        case Role.employee:
          this.applicationParams.property = ApplicationEntityType.Employee;
          this.providerId = this.store.selectSnapshot(RegistrationState.user).id;
          break;
      }
      this.getProviderWorkshops();
    });
    this.actions$.pipe(ofActionSuccessful(BlockParent, UnBlockParent), takeUntil(this.destroy$)).subscribe(() => this.onGetApplications());
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

  private onGetApplications(): void {
    this.store.dispatch(new GetApplicationsByPropertyId(this.providerId, this.applicationParams));
  }

  private getProviderWorkshops(): void {
    switch (this.role) {
      case Role.provider:
        this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
        break;
      case Role.providerDeputy:
      case Role.employee:
        this.store.dispatch(new GetWorkshopListByEmployeeId(this.providerId));
        break;
    }
  }
}

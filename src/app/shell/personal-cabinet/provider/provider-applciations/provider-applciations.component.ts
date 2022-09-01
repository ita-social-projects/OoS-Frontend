import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { takeUntil, filter } from 'rxjs/operators';
import { Application, ApplicationParameters, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { UserState } from 'src/app/shared/store/user.state';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Observable } from 'rxjs';
import { 
  GetApplicationsByProviderId, 
  GetWorkshopsByProviderId, 
  UpdateApplication 
} from 'src/app/shared/store/user.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { EntityType, Role } from 'src/app/shared/enum/role';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { GetProviderAdminWorkshops } from 'src/app/shared/store/provider.actions';

@Component({
  selector: 'app-provider-applciations',
  templateUrl: './provider-applciations.component.html',
})
export class ProviderApplciationsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly WorkshopDeclination = WorkshopDeclination;

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  providerId: string;

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
        this.providerId = this.subRole === Role.ProviderAdmin ? 
        this.store.selectSnapshot(RegistrationState.user).id:
        provider.id;
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

  private getProviderWorkshops(): void {
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetWorkshopsByProviderId(this.providerId));
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

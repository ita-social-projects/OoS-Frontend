import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store } from '@ngxs/store';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { debounceTime, mergeMap, takeUntil, filter } from 'rxjs/operators';
import { Child } from 'src/app/shared/models/child.model';
import { ApplicationsComponent } from '../../shared-cabinet/applications.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Application, ApplicationUpdate } from 'src/app/shared/models/application.model';
import { UserState } from 'src/app/shared/store/user.state';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Observable } from 'rxjs';
import { 
  GetApplicationsByProviderId, 
  GetProviderAdminWorkshops, 
  GetWorkshopsByProviderId, 
  UpdateApplication 
} from 'src/app/shared/store/user.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { EntityType, Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-provider-applciations',
  templateUrl: './provider-applciations.component.html',
  styleUrls: ['./provider-applciations.component.scss'],
})
export class ProviderApplciationsComponent extends ApplicationsComponent implements OnInit, OnDestroy {
  readonly WorkshopDeclination = WorkshopDeclination;

  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  providerId: string;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    protected router: Router,
    protected route: ActivatedRoute,
    protected actions$: Actions,
  ) {
    super(store, matDialog, router, route, actions$);
  }

  init(): void {
    super.init();
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
        this.getApplications();
      });
  }

  protected getApplications(): void {
    this.store.dispatch(new GetApplicationsByProviderId(this.providerId, this.applicationParams));
  }

  /**
   * This method changes status of emitted event to "approved"
   * @param Application event
   */
  onApprove(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(application.id, this.applicationStatus.Approved);
    this.store.dispatch(new UpdateApplication(applicationUpdate));
  }

  /**
   * This method changes status of emitted event to "rejected"
   * @param Application event
   */
  onReject(application: Application): void {
    const applicationUpdate = new ApplicationUpdate(
      application.id,
      this.applicationStatus.Rejected,
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
    this.getApplications();
  }
}

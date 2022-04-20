import { GetAllUsersChildren, GetUsersChildren, OnUpdateApplicationSuccess } from './../../../shared/store/user.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from './../../../shared/enum/applications';
import { ApplicationTitles } from './../../../shared/enum/enumUA/applications';
import { Role } from './../../..//shared/enum/role';
import { Application } from './../../..//shared/models/application.model';
import { ChildCards } from './../../..//shared/models/child.model';
import { Parent } from './../../..//shared/models/parent.model';
import { Provider } from './../../..//shared/models/provider.model';
import { User } from './../../../shared/models/user.model';
import { WorkshopCard } from './../../../shared/models/workshop.model';
import { RegistrationState } from './../../../shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId, GetWorkshopsByProviderId } from './../../../shared/store/user.actions';
import { UserState } from './../../../shared/store/user.state';

@Component({
  selector: 'app-cabinet-data',
  template: '',
})
export abstract class CabinetDataComponent implements OnInit, OnDestroy {

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly Role: typeof Role = Role;

  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  @Select(UserState.children)
  childrenCards$: Observable<ChildCards>;
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider: Provider;
  parent: Parent;
  role: string;

  workshops: WorkshopCard[];
  applications: Application[];
  childrenCards: ChildCards;

  constructor(public store: Store, public matDialog: MatDialog, protected actions$: Actions) { }

  ngOnInit(): void { }

  abstract init(): void;

  getUserData(): void {
    this.role$.pipe(filter((role: string) => !!role)).subscribe((role: string) => {
      this.role = role;

      if (this.role === Role.provider) {
        this.provider$.pipe(
          filter((provider: Provider) => !!provider),
          takeUntil(this.destroy$)
        ).subscribe((provider: Provider) => {
          this.provider = provider;
          this.init();
        });
      } else {
        this.parent$.pipe(
          filter((parent: Parent) => !!parent),
          takeUntil(this.destroy$)
        ).subscribe((parent: Parent) => {
          this.parent = parent;
          this.init();
        });
      }
    });

    this.applications$.pipe(
      filter((applications: Application[]) => !!applications),
      takeUntil(this.destroy$)
    ).subscribe((applications: Application[]) => this.applications = applications);
  }

  getProviderApplications(providerApplicationParams): void {
    this.store.dispatch(new GetApplicationsByProviderId(this.provider.id, providerApplicationParams));
  }

  getParentApplications(): void {
    this.store.dispatch(new GetApplicationsByParentId(this.parent.id));
  }

  getUsersChildren(): void {
    this.store.dispatch(new GetUsersChildren());
  }

  getAllUsersChildren(): void {
    this.store.dispatch(new GetAllUsersChildren());
  }

  getProviderWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

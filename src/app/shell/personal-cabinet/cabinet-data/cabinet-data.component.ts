import { GetApplicationsByStatus } from './../../../shared/store/user.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus, ApplicationTitles } from 'src/app/shared/enum/applications';
import { Role } from 'src/app/shared/enum/role';
import { Application } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId, GetChildrenByParentId, GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-cabinet-data',
  templateUrl: './cabinet-data.component.html',
  styleUrls: ['./cabinet-data.component.scss']
})
export abstract class CabinetDataComponent implements OnInit, OnDestroy {

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly role: typeof Role = Role;

  @Select(UserState.workshops)
  workshops$: Observable<Workshop[]>;
  @Select(UserState.applications)
  applications$: Observable<Application[]>;
  @Select(UserState.children)
  children$: Observable<Child[]>;
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  userRole: string;
  provider: Provider;
  parent: Parent;
  workshops: Workshop[];
  applications: Application[];
  children: Child[];

  constructor(public store: Store, public matDialog: MatDialog) { }

  ngOnInit(): void { }

  abstract init(): void;

  getUserData(): void {
    this.user$.pipe(filter((user: User) => !!user)).subscribe((user: User) => {
      this.userRole = user.role;

      if (this.userRole === Role.provider) {
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

  }

  getProviderApplications(providerApplicationParams): void {
    this.store.dispatch(new GetApplicationsByProviderId(this.provider.id, providerApplicationParams));
  }

  getParenApplications(): void {
    this.store.dispatch(new GetApplicationsByParentId(this.parent.id));
  }

  getParenChildren(): void {
    this.store.dispatch(new GetChildrenByParentId(this.parent.id));
  }

  getProviderWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

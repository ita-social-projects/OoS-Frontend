import { GetAllUsersChildren, GetUsersChildren } from './../../../shared/store/user.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { Role } from 'src/app/shared/enum/role';
import { ApplicationCards } from 'src/app/shared/models/application.model';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { PopNavPath } from 'src/app/shared/store/navigation.actions';

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
  applicationCards$: Observable<ApplicationCards>;
  @Select(UserState.children)
  childrenCards$: Observable<ChildCards>;
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(RegistrationState.role)
  role$: Observable<Role>;
  role: string;
  @Select(RegistrationState.subrole)
  subRole$: Observable<Role>;
  subRole: Role;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider: Provider;
  parent: Parent;

  workshops: WorkshopCard[];
  applicationCards: ApplicationCards;
  childrenCards: Child[];
  filteredChildren: Child[];

  constructor(protected store: Store, protected matDialog: MatDialog) {}

  ngOnInit(): void {
    combineLatest([this.role$, this.subRole$])
      .pipe(
        filter(([role, subRole]: [Role, Role]) => !!role),
        takeUntil(this.destroy$)
      )
      .subscribe(([role, subRole]: [Role, Role]) => {
        this.role = role;
        this.subRole = subRole;
        this.init();
      });
  }

  abstract init(): void;

  // getUserData(): void {

  //   this.applicationCards$
  //     .pipe(
  //       filter((applicationCards: ApplicationCards) => !!applicationCards),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe((applicationCards: ApplicationCards) => (this.applicationCards = applicationCards));

  //   this.childrenCards$
  //     .pipe(
  //       filter((childrenCards: ChildCards) => !!childrenCards),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe((childrenCards: ChildCards) => (this.filteredChildren = this.childrenCards = childrenCards.entities));
  // }
  // if (this.role === Role.provider) {

  // } else {
  //   this.parent$.pipe(
  //     filter((parent: Parent) => !!parent),
  //     takeUntil(this.destroy$)
  //   ).subscribe((parent: Parent) => {
  //     this.parent = parent;
  //   });
  // }
  getProviderApplications(applicationParams): void {
    this.store.dispatch(new GetApplicationsByProviderId(this.provider.id, applicationParams));
  }

  getParentApplications(applicationParams): void {
    this.store.dispatch(new GetApplicationsByParentId(this.parent.id, applicationParams));
  }

  getUsersChildren(): void {
    this.store.dispatch(new GetUsersChildren());
  }

  getAllUsersChildren(): void {
    this.store.dispatch(new GetAllUsersChildren());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

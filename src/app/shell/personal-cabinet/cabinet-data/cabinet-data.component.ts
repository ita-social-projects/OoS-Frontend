import { GetAllUsersChildren, GetUsersChildren } from './../../../shared/store/user.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { Role } from 'src/app/shared/enum/role';
import { ApplicationCards, } from 'src/app/shared/models/application.model';
import { Child, ChildCards } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetApplicationsByParentId, GetApplicationsByProviderId, GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
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
  role$: Observable<string>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider: Provider;
  parent: Parent;
  role: string;

  workshops: WorkshopCard[];
  applicationCards: ApplicationCards;
  childrenCards: Child[];
  filteredChildren: Child[]

  constructor(
    public store: Store, 
    public matDialog: MatDialog, 
    protected actions$: Actions, 
    protected navigationBarService: NavigationBarService) { }

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

    this.applicationCards$.pipe(
      filter((applicationCards: ApplicationCards) => !!applicationCards),
      takeUntil(this.destroy$)
    ).subscribe((applicationCards: ApplicationCards) => this.applicationCards = applicationCards);

    this.childrenCards$.pipe(
      filter((childrenCards: ChildCards) => !!childrenCards),
      takeUntil(this.destroy$)
    ).subscribe((childrenCards: ChildCards) => this.filteredChildren = this.childrenCards = childrenCards.entities);
  }

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

  getProviderWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

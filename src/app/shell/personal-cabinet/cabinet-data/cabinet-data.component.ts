import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Role } from 'src/app/shared/enum/role';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UserState } from 'src/app/shared/store/user.state';
import { PopNavPath } from 'src/app/shared/store/navigation.actions';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-cabinet-data',
  template: '',
})
export abstract class CabinetDataComponent implements OnInit, OnDestroy {
  readonly constants: typeof Constants = Constants;
  readonly Role: typeof Role = Role;

  @Select(RegistrationState.role)
  role$: Observable<Role>;
  role: string;
  @Select(RegistrationState.subrole)
  subRole$: Observable<Role>;
  subRole: Role;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  // @Select(UserState.workshops)
  // workshops$: Observable<WorkshopCard[]>;
 
  // @Select(UserState.children)
  // childrenCards$: Observable<ChildCards>;
  // @Select(RegistrationState.parent)
  // parent$: Observable<Parent>;
  // @Select(RegistrationState.provider)
  // provider$: Observable<Provider>;


  destroy$: Subject<boolean> = new Subject<boolean>();
  
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
        this.addNavPath();
      });
  }

  protected abstract init(): void;
  protected abstract addNavPath(): void;

  
  // getUsersChildren(): void {
  //   this.store.dispatch(new GetUsersChildren());
  // }

  // getAllUsersChildren(): void {
  //   this.store.dispatch(new GetAllUsersChildren());
  // }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

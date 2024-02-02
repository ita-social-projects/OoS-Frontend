import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { Role, Subrole } from 'shared/enum/role';
import { PopNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { SharedUserState } from 'shared/store/shared-user.state';

@Component({
  selector: 'app-cabinet-data',
  template: ''
})
export abstract class CabinetDataComponent implements OnInit, OnDestroy {
  readonly constants = Constants;
  readonly Role = Role;
  readonly Subrole = Subrole;

  @Select(RegistrationState.role)
  role$: Observable<Role>;
  @Select(RegistrationState.subrole)
  subrole$: Observable<Subrole>;
  @Select(SharedUserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  role: Role;
  subrole: Subrole;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    combineLatest([this.role$, this.subrole$])
      .pipe(
        filter(([role, subrole]: [Role, Subrole]) => !!role),
        takeUntil(this.destroy$)
      )
      .subscribe(([role, subrole]: [Role, Subrole]) => {
        this.role = role;
        this.subrole = subrole;
        this.init();
        this.addNavPath();
      });
  }

  protected abstract init(): void;
  protected abstract addNavPath(): void;

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

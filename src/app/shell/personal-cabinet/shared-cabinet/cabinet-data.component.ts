import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { PopNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { SharedUserState } from 'shared/store/shared-user.state';

@Component({
  selector: 'app-cabinet-data',
  template: ''
})
export abstract class CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(SharedUserState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;

  public role: Role;

  protected readonly constants = Constants;
  protected readonly Role = Role;

  protected destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.role$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((role) => {
      this.role = role;
      this.init();
      this.addNavPath();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  protected abstract init(): void;
  protected abstract addNavPath(): void;
}

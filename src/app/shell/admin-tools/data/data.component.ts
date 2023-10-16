import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AdminTabTypes } from 'shared/enum/admins';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html'
})
export class DataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.addNavPath();
  }

  private addNavPath(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => {
      let path: string;
      let queryParams: Params;

      switch (role as Role) {
        case Role.techAdmin:
          path = '/admin-tools/platform';
          queryParams = { page: AdminTabTypes.AboutPortal };
          break;
        case Role.ministryAdmin:
        case Role.regionAdmin:
          path = './admin-tools/data/admins';
          break;
        case Role.areaAdmin:
          path = './admin-tools/data/provider-list';
          break;
      }

      this.store.dispatch(
        new AddNavPath(
          this.navigationBarService.createOneNavPath({
            name: NavBarName.Administration,
            path,
            queryParams,
            isActive: false,
            disable: false
          })
        )
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}

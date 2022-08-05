import { MinistryAdmin } from './../../../../shared/models/ministryAdmin.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, takeUntil} from 'rxjs/operators';
import { AdminRole } from 'src/app/shared/enum/admins';
import { AdminRoleUkr, AdminRoleUkrReverse } from 'src/app/shared/enum/enumUA/admins';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Role } from 'src/app/shared/enum/role';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { UserState } from 'src/app/shared/store/user.state';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {
  readonly noAdmins = NoResultsTitle.noAdmins;
  readonly adminRole = AdminRole;
  readonly adminRoleUkr = AdminRoleUkr;
  readonly Role = Role;
  
  @Select(RegistrationState.role)
  role$: Observable<Role>;
  role: string;
  @Select(RegistrationState.subrole)
  subRole$: Observable<Role>;
  subRole: Role;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.ministryAdmin)
  ministryAdmin$: Observable<MinistryAdmin>;
  ministryAdmin: MinistryAdmin;
  tabIndex: number;
  displayedColumns: string[] = ['pib', 'email', 'phone', 'place', 'role', 'status'];
  filterValue: string;
  filterFormControl: FormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor(    
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog) { }

ngOnInit(): void {

  combineLatest([this.role$, this.subRole$])
  .pipe(
    filter(([role, subRole]: [Role, Role]) => !!role),
    takeUntil(this.destroy$)
  )
  .subscribe(([role, subRole]: [Role, Role]) => {
    this.role = role;
    this.subRole = subRole;
    this.addNavPath();
  });
}

/**
 * This method filter admins according to selected tab
 * @param event: MatTabChangeEvent
 */
onTabChange(event: MatTabChangeEvent): void {
  this.filterFormControl.reset();
  this.router.navigate(['./'], {
    relativeTo: this.route,
    queryParams: { role: AdminRoleUkrReverse[event.tab.textLabel] },
  });
}

addNavPath(): void {
  this.store.dispatch(
    new PushNavPath({
      name: NavBarName.Admins,
      isActive: false,
      disable: true,
    })
  );
}

ngOnDestroy(): void {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
  this.store.dispatch(new PopNavPath());
}
}

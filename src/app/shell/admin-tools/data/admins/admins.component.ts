import { MinistryAdmin } from './../../../../shared/models/ministryAdmin.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AdminRole } from 'src/app/shared/enum/admins';
import { AdminRoleUkr, AdminRoleUkrReverse } from 'src/app/shared/enum/enumUA/admins';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Role } from 'src/app/shared/enum/role';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
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
  ) {}

  ngOnInit(): void {
    this.addNavPath();
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

  private addNavPath(): void {
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

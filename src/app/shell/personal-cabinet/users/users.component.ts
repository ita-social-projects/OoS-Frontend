import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { providerAdminRoleUkr } from 'src/app/shared/enum/enumUA/provider-admin';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import { ProviderAdminBackend, ProviderAdminTable } from 'src/app/shared/models/providerAdmin.model';
import { GetAllProviderAdmins } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  readonly providerAdminRoleUkr = providerAdminRoleUkr;
  readonly providerAdminRole = providerAdminRole;

  @Select(UserState.providerAdmins)
  providerAdmins$: Observable<ProviderAdminBackend[]>;
  providerAdmins: ProviderAdminTable[];
  filterProviderAdmins: Array<object> = [];
  filter = new FormControl('');
  filterValue: string;
  btnView: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.btnView = providerAdminRoleUkr.all;
    this.filter.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(200), distinctUntilChanged())
      .subscribe((val) => {
        if (val) {
          this.filterValue = val;
        } else {
          this.filterValue = '';
        }
      });
    this.getAllProviderAdmins();

    this.providerAdmins$
      .pipe(takeUntil(this.destroy$))
      .subscribe((providerAdmins: ProviderAdminBackend[]) => {
        this.providerAdmins = this.updateStructureForTheTable(providerAdmins);
      });
  }

  getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
  }

  updateStructureForTheTable(admins: ProviderAdminBackend[]): ProviderAdminTable[] {
    let updatedAdmins = [];
    admins.forEach((admin) => {
      updatedAdmins.push({
        pib: `${admin.lastName} ${admin.firstName} ${admin.middleName}`,
        email: admin.email,
        phone: admin.phone,
        deputy: (admin.isDeputy) ? providerAdminRoleUkr.deputy : providerAdminRoleUkr.admin
      });
      
    });
    return updatedAdmins;
  }

  /**
   * This method filter users according to selected tab
   * @param event: MatTabChangeEvent
   */
  onTabChange(event: MatTabChangeEvent): void {
    this.btnView = event.tab.textLabel;
    this.filterProviderAdmins = this.providerAdmins.filter(
      (user) => user.deputy === event.tab.textLabel
    );
    this.filter.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}

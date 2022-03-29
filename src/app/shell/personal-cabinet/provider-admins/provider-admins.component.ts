import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { providerAdminRoleUkr, providerAdminRoleUkrReverse } from 'src/app/shared/enum/enumUA/provider-admin';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import { ProviderAdmin, ProviderAdminTable } from 'src/app/shared/models/providerAdmin.model';
import { GetAllProviderAdmins } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';


@Component({
  selector: 'app-provider-admins',
  templateUrl: './provider-admins.component.html',
  styleUrls: ['./provider-admins.component.scss']
})
export class ProviderAdminsComponent implements OnInit, OnDestroy {

  readonly providerAdminRoleUkr = providerAdminRoleUkr;
  readonly providerAdminRole = providerAdminRole;
  readonly noProviderAdmins = NoResultsTitle.noProviderAdmins;

  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(UserState.providerAdmins)
  providerAdmins$: Observable<ProviderAdmin[]>;
  providerAdmins: ProviderAdminTable[];
  filteredProviderAdmins: Array<object> = [];
  filter = new FormControl('');
  filterValue: string;
  btnView: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex: number;

  constructor(
    public store: Store,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.btnView = providerAdminRoleUkr.all;
    this.filter.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(200), distinctUntilChanged())
      .subscribe((val: string) => {
        if (val) {
          this.filterValue = val;
        } else {
          this.filterValue = '';
        }
      });
    this.getAllProviderAdmins();

    this.providerAdmins$
      .pipe(takeUntil(this.destroy$))
      .subscribe((providerAdmins: ProviderAdmin[]) => {
        this.providerAdmins = this.updateStructureForTheTable(providerAdmins);
        this.filterProviderAdmins();
      });
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.tabIndex = Object.keys(this.providerAdminRole).indexOf(params.param);
        this.btnView = providerAdminRoleUkr[params.param];
      })
  }

  getAllProviderAdmins(): void {
    this.store.dispatch(new GetAllProviderAdmins());
  }
  filterProviderAdmins(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.filteredProviderAdmins = this.providerAdmins.filter(
          (user) => user.deputy === providerAdminRoleUkr[params.param]
        );
      })
    }

  updateStructureForTheTable(admins: ProviderAdmin[]): ProviderAdminTable[] {
    let updatedAdmins = [];
    admins.forEach((admin) => {
      updatedAdmins.push({
        pib: `${admin.lastName} ${admin.firstName} ${admin.middleName}`,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
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
    this.filterProviderAdmins();
    this.filter.reset();
    this.router.navigate(['../', providerAdminRoleUkrReverse[event.tab.textLabel]], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}

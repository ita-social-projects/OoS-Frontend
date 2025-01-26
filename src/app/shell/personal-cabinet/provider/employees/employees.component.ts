import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { EmployeeTitles } from 'shared/enum/enumUA/employee';
import { UserStatusesTitles } from 'shared/enum/enumUA/statuses';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { EmployeeParams, EmployeeRole } from 'shared/enum/employee';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Employee, EmployeeParameters } from 'shared/models/employee.model';
import { SearchResponse } from 'shared/models/search.model';
import { EmployeesBlockData, EmployeesTableData } from 'shared/models/users-table';
import { PushNavPath } from 'shared/store/navigation.actions';
import { BlockEmployeeById, DeleteEmployeeById, GetFilteredEmployees, ReinviteEmployee } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { Util } from 'shared/utils/utils';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(ProviderState.employees)
  private employees$: Observable<SearchResponse<Employee[]>>;

  public readonly EmployeeTitles = EmployeeTitles;
  public readonly employeeRole = EmployeeRole;
  public readonly noEmployees = NoResultsTitle.noUsers;
  public readonly constants = Constants;
  public readonly statusesTitles = UserStatusesTitles;

  public employees: SearchResponse<Employee[]>;
  public employeesData: EmployeesTableData[] = [];
  public filterFormControl: FormControl = new FormControl('');
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public tabIndex: number;
  public filterParams: EmployeeParameters = {
    searchString: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public isSmallMobileView: boolean;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, matDialog);
  }

  @HostListener('window: resize', ['$event.target'])
  public onResize(event: Window): void {
    this.isSmallMobileView = event.innerWidth <= 480;
  }

  public ngOnInit(): void {
    super.ngOnInit();
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.employees?.totalAmount);

    this.setTabOptions();
    this.getFilteredEmployees();
    this.onResize(window);
  }

  /**
   * This method filter users according to selected tab
   * @param event MatTabChangeEvent
   */
  public onTabChange(event: MatTabChangeEvent): void {
    this.currentPage = PaginationConstants.firstPage;
    this.filterFormControl.reset('', { emitEvent: false });
    this.filterParams.searchString = '';
    this.filterParams.from = 0;
    this.getFilteredEmployees();
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { role: EmployeeParams[event.index] }
    });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getFilteredEmployees();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.filterParams.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  /**
   * This method update employee By Id
   */
  public onUpdate(user: EmployeesTableData): void {
    const userRole = EmployeeRole.admin;
    this.router.navigate([`update-employee/${userRole}/${user.id}`]);
  }

  /**
   * This method block and unBlock employee By Id
   */
  public onBlockUnblock(admin: EmployeesBlockData): void {
    const messageType = admin.isBlocking ? ModalConfirmationType.blockEmployee : ModalConfirmationType.unBlockEmployee;

    this.matDialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: messageType,
          property: admin.user.pib
        }
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(
          new BlockEmployeeById(
            {
              userId: admin.user.id,
              providerId: this.provider.id,
              isBlocked: admin.isBlocking
            },
            this.filterParams
          )
        );
      });
  }

  /**
   * This method delete employee By Id
   */
  public onDelete(user: EmployeesTableData): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteEmployee,
        property: user.pib
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(
          new DeleteEmployeeById(
            {
              userId: user.id,
              providerId: this.provider.id
            },
            this.filterParams
          )
        );
      });
  }

  public onSendInvitation(employee: Employee): void {
    this.store.dispatch(new ReinviteEmployee(employee));
  }

  protected initProviderData(): void {
    this.addEmployeesSubscriptions();
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Administration,
        isActive: false,
        disable: true
      })
    );
  }

  private setTabOptions(): void {
    const role = this.route.snapshot.queryParamMap.get('role');
    this.tabIndex = role ? Object.keys(this.employeeRole).indexOf(role) : 0;
    this.currentPage = PaginationConstants.firstPage;
  }

  private getFilteredEmployees(): void {
    Util.setFromPaginationParam(this.filterParams, this.currentPage, this.employees?.totalAmount);
    this.store.dispatch(new GetFilteredEmployees(this.filterParams));
  }

  /**
   * This method subscribes on employees and filter form control value changing for data filtration
   */
  private addEmployeesSubscriptions(): void {
    this.filterFormControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.filterParams.searchString = val;
        this.currentPage = PaginationConstants.firstPage;
        this.getFilteredEmployees();
      });

    this.employees$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((employees: SearchResponse<Employee[]>) => {
      this.employees = employees;
      this.employeesData = Util.updateStructureForTheTableEmployees(employees.entities);
    });
  }
}

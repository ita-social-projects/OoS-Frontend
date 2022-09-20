import { MinistryAdmin } from './../../../../shared/models/ministryAdmin.model';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map, skip } from 'rxjs/operators';
import { AdminState } from './../../../../shared/store/admin.state';
import { BlockMinistryAdminById, DeleteMinistryAdminById, GetAllMinistryAdmins } from './../../../../shared/store/admin.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { AdminRole } from 'src/app/shared/enum/admins';
import { AdminRoleUkr, AdminRoleUkrReverse } from 'src/app/shared/enum/enumUA/admins';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Role } from 'src/app/shared/enum/role';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { UntypedFormControl } from '@angular/forms';
import { AllMinistryAdmins } from 'src/app/shared/models/ministryAdmin.model';
import { Util } from 'src/app/shared/utils/utils';
import { UsersTable } from 'src/app/shared/models/usersTable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { OnPageChangeAdminTable, SetAdminsPerPage, SetFirstPage } from 'src/app/shared/store/paginator.actions';

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

  @Select(AdminState.ministryAdmins)
  ministryAdmins$: Observable<AllMinistryAdmins>;
  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(PaginatorState.adminsPerPage)
  adminsPerPage$: Observable<number>;
  
  tabIndex: number;
  filterValue: string;
  filterFormControl: UntypedFormControl = new UntypedFormControl('');
  ministryAdminsTable: UsersTable[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  totalEntities: number;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  
  constructor(    
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    protected matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.filterFormControl.valueChanges
      .pipe( 
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(2000),
        map((value: string)=> value.trim()))
      .subscribe((searchString: string) => 
      this.store.dispatch(new GetAllMinistryAdmins(searchString))
      );

    this.ministryAdmins$
    .pipe(
      takeUntil(this.destroy$),
      filter((ministryAdmins: AllMinistryAdmins) => !!ministryAdmins)
    )
    .subscribe((ministryAdmins: AllMinistryAdmins)=> {
      this.ministryAdminsTable = Util.updateStructureForTheTableAdmins(ministryAdmins.entities);
      this.totalEntities = ministryAdmins.totalAmount;
    });

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

  /**
  * This method block Admin By Id
  */
  onBlock(admin: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.blockMinistryAdmin,
        property: admin.pib,
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new BlockMinistryAdminById(admin.id)
        );
    });
  }

  /**
   * This method delete Admin By Id
  */
  onDelete(admin: UsersTable): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteMinistryAdmin,
        property: admin.pib,
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      result &&
        this.store.dispatch(
          new DeleteMinistryAdminById(admin.id)
        );
    });
  }

  private addNavPath(): void {
    this.store.dispatch([ 
      new GetAllMinistryAdmins(),
      new PushNavPath({
        name: NavBarName.Admins,
        isActive: false,
        disable: true,
      })
    ]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetAllMinistryAdmins()]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetAdminsPerPage(itemsPerPage), new GetAllMinistryAdmins()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

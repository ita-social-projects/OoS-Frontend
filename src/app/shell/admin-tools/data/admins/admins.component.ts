import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map } from 'rxjs/operators';
import { AdminState } from './../../../../shared/store/admin.state';
import { DeleteMinistryAdminById, GetAllMinistryAdmins } from './../../../../shared/store/admin.actions';
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
import { FormControl } from '@angular/forms';
import { AllMinistryAdmins } from 'src/app/shared/models/ministryAdmin.model';
import { Util } from 'src/app/shared/utils/utils';
import { UsersTable } from 'src/app/shared/models/usersTable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';

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
  
  tabIndex: number;
  filterValue: string;
  filterFormControl: FormControl = new FormControl('');
  ministryAdmins: UsersTable[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  
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
        debounceTime(2000),
        map((value: string)=> value.trim()))
      .subscribe((searchString:string)=> this.store.dispatch(new GetAllMinistryAdmins(searchString)));

    this.ministryAdmins$
    .pipe(
      takeUntil(this.destroy$),
      filter((ministryAdmins: AllMinistryAdmins) => !!ministryAdmins)
    )
    .subscribe((ministryAdmins: AllMinistryAdmins)=> {
      this.ministryAdmins = Util.updateStructureForTheTableAdmins(ministryAdmins.entities);
    });

    this.addNavPath();
    this.store.dispatch(new GetAllMinistryAdmins());
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
     onBlock(user): void {
      // const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      //   width: Constants.MODAL_SMALL,
      //   data: {
      //     type: user.deputy ? ModalConfirmationType.blockProviderAdminDeputy : ModalConfirmationType.blockProviderAdmin,
      //     property: user.pib,
      //   },
      // });
  
      // dialogRef.afterClosed().subscribe((result: boolean) => {
      //   result &&
      //     this.store.dispatch(
      //       new BlockProviderAdminById({
      //         userId: user.id,
      //         providerId: this.provider.id,
      //       })
      //     );
      // });
    }

  /**
   * This method delete Admin By Id
  */
     onDelete(admin): void {
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

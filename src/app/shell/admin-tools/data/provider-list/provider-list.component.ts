import { ModalConfirmationType } from './../../../../shared/enum/modal-confirmation';
import { ConfirmationModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import {
  DeleteProviderById,
  UpdateProviderStatus
} from './../../../../shared/store/provider.actions';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
  startWith,
  map,
  skip
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Constants,
  PaginationConstants
} from '../../../../shared/constants/constants';
import { ApplicationIcons } from '../../../../shared/enum/applications';
import { AdminState } from '../../../../shared/store/admin.state';
import {
  Provider,
  ProviderStatusUpdateData
} from '../../../../shared/models/provider.model';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { ProviderService } from '../../../../shared/services/provider/provider.service';
import { GetFilteredProviders } from '../../../../shared/store/admin.actions';
import {
  PopNavPath,
  PushNavPath
} from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import {
  OnPageChangeAdminTable,
  SetItemsPerPage
} from '../../../../shared/store/paginator.actions';
import { OwnershipTypeUkr } from '../../../../shared/enum/enumUA/provider';
import { SearchResponse } from '../../../../shared/models/search.model';
import { MatDialog } from '@angular/material/dialog';
import { ReasonModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { Statuses, StatusTitles } from '../../../../shared/enum/statuses';
@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly constants: typeof Constants = Constants;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly statusTitles = StatusTitles;
  readonly providerAdminIcons = ApplicationIcons;
  readonly statuses = Statuses;

  @Select(AdminState.providers)
  providers$: Observable<SearchResponse<Provider[]>>;
  @Select(PaginatorState.itemsPerPage)
  itemsPerPage$: Observable<number>;

  provider: Provider;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isInfoDisplayed: boolean;
  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'street',
    'director',
    'email',
    'website',
    'shortTitle',
    'phoneNumber',
    'founder',
    'actualAddress',
    'status',
    'star'
  ];
  filterFormControl: FormControl = new FormControl('');
  dataSource = new MatTableDataSource([{}]);
  currentPage: PaginationElement = PaginationConstants.firstPage;
  totalEntities: number;
  searchString: string;

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private store: Store,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.dispatch([
      new GetFilteredProviders(),
      new PushNavPath({
        name: NavBarName.Providers,
        isActive: false,
        disable: true
      })
    ]);
    this.providers$
      .pipe(
        takeUntil(this.destroy$),
        filter((providers) => !!providers)
      )
      .subscribe((providers: SearchResponse<Provider[]>) => {
        this.dataSource = new MatTableDataSource(providers?.entities);
        this.dataSource.sort = this.sort;
        this.totalEntities = providers.totalAmount;
      });

    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        map((value: string) => value.trim())
      )
      .subscribe((searchString: string) => {
        this.searchString = searchString;
        this.store.dispatch(new GetFilteredProviders(searchString));
      });
  }

  ngAfterViewInit(): void {}

  onViewProviderInfo(provider: Provider): void {
    this.provider = provider;
    this.isInfoDisplayed = true;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  onChangeStatus(provider: Provider, status: string): void {
    const statusUpdateData = new ProviderStatusUpdateData(provider.id, status);
    if (status === Statuses.Editing) {
      const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.editingProvider }
      });
      dialogRef.afterClosed().subscribe((statusReason: string) => {
        statusReason &&
          this.store.dispatch(
            new UpdateProviderStatus({ ...statusUpdateData, statusReason })
          );
      });
    } else {
      this.store.dispatch(new UpdateProviderStatus(statusUpdateData));
    }
  }

  onDelete(provider: Provider): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteProvider,
        property: provider.fullTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteProviderById(provider.id));
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([
      new OnPageChangeAdminTable(page),
      new GetFilteredProviders()
    ]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([
      new SetItemsPerPage(itemsPerPage),
      new GetFilteredProviders()
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}

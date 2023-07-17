import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of, Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter, map, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { AdminState } from 'shared/store/admin.state';
import { Provider, ProviderParameters, ProviderStatusUpdateData } from 'shared/models/provider.model';
import { PaginationElement } from 'shared/models/paginationElement.model';
import {
  BlockProviderById,
  GetFilteredProviders,
  GetMinistryAdminProfile,
  GetRegionAdminProfile,
  GetTerritorialCommunityAdminProfile
} from 'shared/store/admin.actions';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { SearchResponse } from 'shared/models/search.model';
import { MatDialog } from '@angular/material/dialog';
import {
  ReasonModalWindowComponent
} from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { LicenseStatuses, ProviderStatuses, UserStatusIcons } from 'shared/enum/statuses';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import {
  ConfirmationModalWindowComponent
} from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { DeleteProviderById, UpdateProviderLicenseStatuse, UpdateProviderStatus } from 'shared/store/provider.actions';
import { OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatusTitles, ProviderStatusTitles } from 'shared/enum/enumUA/statuses';
import { Util } from 'shared/utils/utils';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Institution } from 'shared/models/institution.model';
import {
  ClearCodeficatorSearch,
  GetAllInstitutions,
  GetCodeficatorById,
  GetCodeficatorSearch
} from 'shared/store/meta-data.actions';
import { Codeficator } from 'shared/models/codeficator.model';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { FilterState } from 'shared/store/filter.state';
import { ActivatedRoute } from '@angular/router';
import { RegistrationState } from 'shared/store/registration.state';
import { Role } from 'shared/enum/role';
import { RegionAdmin } from 'shared/models/regionAdmin.model';
import { BaseAdmin } from 'shared/models/admin.model';
import { TerritorialCommunityAdmin } from 'shared/models/territorialCommunityAdmin.model';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly noProviders = NoResultsTitle.noResult;
  readonly ModeConstants = ModeConstants;
  readonly OwnershipTypeEnum = OwnershipTypesEnum;
  readonly ownershipTypes = OwnershipTypes;
  readonly statusIcons = UserStatusIcons;
  readonly providerStatuses = ProviderStatuses;
  readonly providerStatusTitles = ProviderStatusTitles;

  readonly blockedStatus = 'Blocked'; //TODO: should be localized

  readonly licenseStatuses = LicenseStatuses;
  readonly licenseStatusTitles = LicenseStatusTitles;

  @Select(AdminState.providers)
  providers$: Observable<SearchResponse<Provider[]>>;
  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(AdminState.selectedAdmin)
  public selectedAdmin$: Observable<BaseAdmin>;

  selectedAdmin: BaseAdmin;
  role: Role;
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
    'email',
    'phoneNumber',
    'status',
    'star'
  ];
  public filterGroup: FormGroup;
  dataSource = new MatTableDataSource([{}]);
  currentPage: PaginationElement = PaginationConstants.firstPage;
  totalEntities: number;
  providerParameters: ProviderParameters = {
    searchString: '',
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE,
    institutionId: '',
    catottgId: ''
  };
  public regions$: Observable<Codeficator[]>;

  constructor(private liveAnnouncer: LiveAnnouncer,
              protected route: ActivatedRoute,
              private store: Store,
              private matDialog: MatDialog,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.selectedAdmin$.pipe(takeUntil(this.destroy$)).subscribe((admin: BaseAdmin) => this.selectedAdmin = admin);

    this.role$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((role: Role) => {
          this.role = role;

          switch (role) {
            case Role.ministryAdmin:
              return this.store.dispatch(new GetMinistryAdminProfile());
            case Role.regionAdmin:
              return this.store.dispatch(new GetRegionAdminProfile());
            case Role.areaAdmin:
              return this.store.dispatch(new GetTerritorialCommunityAdminProfile());
            default:
              return of(null);
          }
        })
      )
      .subscribe(() => {
        this.setProviderFilterByDefault();
        this.getProviders();
      });

    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Providers,
        isActive: false,
        disable: true
      })
    );
    this.providers$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((providers: SearchResponse<Provider[]>) => {
      this.dataSource = new MatTableDataSource(providers.entities);
      this.dataSource.sort = this.sort;
      this.totalEntities = providers.totalAmount;
    });

    this.filterGroup = this.formBuilder.group({
      searchBarFilter: new FormControl(''),
      institution: new FormControl(''),
      region: new FormControl(''),
      area: new FormControl('')
    });

    if (this.isTechAdmin) {
      this.store.dispatch(new GetAllInstitutions(true));
    }
    if (this.isTechAdmin || this.isMinistryAdmin) {
      this.regions$ = this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.Level1])).pipe(
        takeUntil(this.destroy$),
        map((state) => [...state.metaDataState.codeficatorSearch])
      );
      this.areaFormControl.disable();
    }
    if (this.isRegionAdmin) {
      this.selectedAdmin$.subscribe((admin: RegionAdmin) => {
        this.store
          .dispatch(new GetCodeficatorById(admin.catottgId))
          .pipe(
            takeUntil(this.destroy$),
            switchMap((state) =>
              this.store.dispatch(new GetCodeficatorSearch(state.metaDataState.codeficator.region, [CodeficatorCategories.Level1]))
            )
          )
          .subscribe((state) => {
            const { id: regionId, category } = state.metaDataState.codeficatorSearch[0];

            if (category === CodeficatorCategories.Region) {
              this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], regionId));
            }
          });
        this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], admin.catottgId));
      });
    }

    this.subscribeFormControls();
  }

  private subscribeFormControls() {
    this.searchBarFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$),
        map((value: string) => value.trim())
      )
      .subscribe((searchValue: string) => {
        this.providerParameters.searchString = searchValue;
        this.currentPage = PaginationConstants.firstPage;
        this.getProviders();
      });

    this.institutionFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        if (value !== '') {
          this.providerParameters.institutionId = this.institutionFormControl.value.id;
          this.currentPage = PaginationConstants.firstPage;
          this.getProviders();
        }
      });

    this.regionFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe((value: Codeficator | string) => {
        if (value !== '') {
          this.providerParameters.catottgId = this.regionFormControl.value.id;
          this.currentPage = PaginationConstants.firstPage;
          this.getProviders();
          if ((value as Codeficator).category === CodeficatorCategories.Region) {
            this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], this.regionFormControl.value.id));
            this.areaFormControl.enable();
          } else {
            this.store.dispatch(new ClearCodeficatorSearch());
            this.areaFormControl.disable();
          }
        }
      });

    this.areaFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        if (value !== '') {
          this.providerParameters.catottgId = this.areaFormControl.value.id;
          this.currentPage = PaginationConstants.firstPage;
          this.getProviders();
        }
      });
  }

  public get isTechAdmin(): boolean {
    return this.role === Role.techAdmin;
  }

  public get isMinistryAdmin(): boolean {
    return this.role === Role.ministryAdmin;
  }

  public get isRegionAdmin(): boolean {
    return this.role === Role.regionAdmin;
  }

  public get isTerritorialCommunityAdmin(): boolean {
    return this.role === Role.areaAdmin;
  }

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  private get searchBarFormControl(): FormControl {
    return this.filterGroup.get('searchBarFilter') as FormControl;
  }

  private get institutionFormControl(): FormControl {
    return this.filterGroup.get('institution') as FormControl;
  }

  private get regionFormControl(): FormControl {
    return this.filterGroup.get('region') as FormControl;
  }

  private get areaFormControl(): FormControl {
    return this.filterGroup.get('area') as FormControl;
  }

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

  onChangeStatus(provider: Provider, status: ProviderStatuses): void {
    const statusUpdateData = new ProviderStatusUpdateData(provider.id, status);
    if (status === ProviderStatuses.Editing) {
      const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.editingProvider }
      });
      dialogRef
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe((statusReason: string) =>
          this.store.dispatch(new UpdateProviderStatus({ ...statusUpdateData, statusReason }, this.providerParameters))
        );
    } else {
      this.store.dispatch(new UpdateProviderStatus(statusUpdateData, this.providerParameters));
    }
  }

  onLicenseApprove(providerId: string): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      data: { type: ModalConfirmationType.licenseApproved }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.store.dispatch(
          new UpdateProviderLicenseStatuse({
            providerId,
            licenseStatus: LicenseStatuses.Approved
          }, this.providerParameters)
        )
      );
  }

  onDelete(provider: Provider): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteProvider,
        property: provider.fullTitle
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(new DeleteProviderById(provider.id, this.providerParameters)));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviders();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.providerParameters.size = itemsPerPage;
    this.getProviders();
  }

  onBlock(provider: Provider): void {
    if (provider.isBlocked) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.unBlockProvider,
          property: provider.fullTitle
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.store.dispatch(
            new BlockProviderById(
              {
                id: provider.id,
                isBlocked: false
              },
              this.providerParameters
            )
          );
        }
      });
    } else {
      const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.blockProvider }
      });
      dialogRef.afterClosed().subscribe((result: string) => {
        if (result) {
          this.store.dispatch(new BlockProviderById({
            id: provider.id,
            isBlocked: true,
            blockReason: result
          }, this.providerParameters));
        }
      });
    }
  }

  public onResetFilters(): void {
    if (this.searchBarFormControl.value !== '') {
      this.searchBarFormControl.setValue('', { emitEvent: false });
    }
    if (this.institutionFormControl.value !== '') {
      this.institutionFormControl.setValue('');
    }
    if (this.regionFormControl.value !== '') {
      this.regionFormControl.setValue('');
      this.areaFormControl.setValue('');
      this.areaFormControl.disable();
      this.store.dispatch(new ClearCodeficatorSearch());
    }
    if (this.areaFormControl.value !== '') {
      this.areaFormControl.setValue('');
      this.store.dispatch(new ClearCodeficatorSearch());
    }

    this.checkFiltersParametersForReset();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private checkFiltersParametersForReset() {
    if (this.providerParameters.searchString !== '' || this.providerParameters.size !== PaginationConstants.TABLE_ITEMS_PER_PAGE
      || (this.isTechAdmin && (this.providerParameters.catottgId !== '' || this.providerParameters.institutionId !== ''))
      || (this.isMinistryAdmin && (this.providerParameters.catottgId !== '' || this.providerParameters.institutionId !== this.selectedAdmin.institutionId))
      || ((this.isRegionAdmin || this.isTerritorialCommunityAdmin)
        && (this.providerParameters.catottgId !== String((this.selectedAdmin as RegionAdmin | TerritorialCommunityAdmin).catottgId
          || this.providerParameters.institutionId !== this.selectedAdmin.institutionId)))) {
      this.setProviderFilterByDefault();
      this.getProviders();
    }
  }

  private setProviderFilterByDefault() {
    this.providerParameters.searchString = '';
    this.providerParameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;

    switch (this.role) {
      case Role.ministryAdmin:
        this.providerParameters.institutionId = this.selectedAdmin.institutionId;
        this.providerParameters.catottgId = '';
        break;
      case Role.regionAdmin || Role.areaAdmin:
        this.providerParameters.institutionId = this.selectedAdmin.institutionId;
        this.providerParameters.catottgId = String((this.selectedAdmin as RegionAdmin | TerritorialCommunityAdmin).catottgId);
        break;
      default:
        this.providerParameters = {
          searchString: '',
          size: PaginationConstants.TABLE_ITEMS_PER_PAGE,
          institutionId: '',
          catottgId: ''
        };
    }
  }

  private getProviders(): void {
    Util.setFromPaginationParam(this.providerParameters, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetFilteredProviders(this.providerParameters));
  }
}

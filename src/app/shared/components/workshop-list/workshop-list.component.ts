import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, skip, startWith, Subject, switchMap, takeUntil } from 'rxjs';

import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { ProviderStatusTitles } from 'shared/enum/enumUA/statuses';
import { FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { OwnershipTypes } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { ProviderStatuses, UserStatusIcons } from 'shared/enum/statuses';
import { BaseAdmin } from 'shared/models/admin.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { Institution } from 'shared/models/institution.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { GetAreaAdminProfile, GetMinistryAdminProfile, GetRegionAdminProfile } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { FilterState } from 'shared/store/filter.state';
import { ClearCodeficatorSearch, GetAllInstitutions, GetCodeficatorById, GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { GetProfile } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) public sort: MatSort;

  @Input() public workshops: SearchResponse<Workshop[]>;
  @Input() public setWorkshopFiltersByDefault: (workshopParameters: WorkshopFilterAdministration) => void;

  @Output() public getWorkshopsByFilter: EventEmitter<WorkshopFilterAdministration>; // TODO: Add filter for Provider

  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(FilterState.settlement)
  public settlement$: Observable<Codeficator>;
  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(AdminState.selectedAdmin)
  public selectedAdmin$: Observable<BaseAdmin>;

  public readonly noWorkshops = NoResultsTitle.noResult;
  public readonly ModeConstants = ModeConstants;
  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly statusIcons = UserStatusIcons;
  public readonly providerStatuses = ProviderStatuses;
  public readonly providerStatusTitles = ProviderStatusTitles;
  public readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;

  public readonly blockedStatus = 'Blocked'; // TODO: should be localized

  public selectedAdmin: BaseAdmin;
  public role: Role;
  public workshop: Workshop;
  public isInfoDisplayed: boolean;
  public displayedColumns: string[] = [
    'title',
    'providerTitle',
    'providerOwnership',
    'formOfLearning',
    'seats',
    'city',
    'street',
    'status',
    'rating'
  ];
  public filterGroup: FormGroup;
  public dataSource = new MatTableDataSource([{}]);
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public totalEntities: number;
  public workshopParameters: WorkshopFilterAdministration;
  public regions$: Observable<Codeficator[]>;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    protected route: ActivatedRoute,
    private store: Store,
    // private matDialog: MatDialog,
    // TODO: Add when dialog actions will be implemented
    private formBuilder: FormBuilder
  ) {}

  public get isTechAdmin(): boolean {
    return this.role === Role.techAdmin;
  }

  public get isMinistryAdmin(): boolean {
    return this.role === Role.ministryAdmin;
  }

  public get isRegionAdmin(): boolean {
    return this.role === Role.regionAdmin;
  }

  public get isAreaAdmin(): boolean {
    return this.role === Role.areaAdmin;
  }

  public get isModerator(): boolean {
    return this.role === Role.moderator || this.role === Role.provider;
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

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  public ngOnInit(): void {
    this.selectedAdmin$.pipe(takeUntil(this.destroy$)).subscribe((admin: BaseAdmin) => (this.selectedAdmin = admin));

    this.role$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((role: Role) => {
          this.role = role;

          switch (role) {
            case Role.techAdmin:
              return of(null);
            case Role.ministryAdmin:
              return this.store.dispatch(new GetMinistryAdminProfile());
            case Role.regionAdmin:
              return this.store.dispatch(new GetRegionAdminProfile());
            case Role.areaAdmin:
              return this.store.dispatch(new GetAreaAdminProfile());
            case Role.moderator:
            case Role.provider:
              // TODO: Add moderator Profile fetch
              return this.store.dispatch(new GetProfile());
          }
        })
      )
      .subscribe(() => {
        this.setInitialWorkshopFilterByDefault();
        this.getWorkshops();
      });

    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Workshops,
        isActive: false,
        disable: true
      })
    );

    this.dataSource = new MatTableDataSource(this.workshops.entities);
    this.dataSource.sort = this.sort;
    this.totalEntities = this.workshops.totalAmount;

    this.filterGroup = this.formBuilder.group({
      searchBarFilter: new FormControl(''),
      institution: new FormControl(''),
      region: new FormControl(''),
      area: new FormControl('')
    });

    this.setInformationDependingOnRole();
    this.subscribeFormControls();
  }

  public onViewWorkshopInfo(workshop: Workshop): void {
    this.workshop = workshop;
    this.isInfoDisplayed = true;
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  public onChangeStatus(workshop: Workshop, status: ProviderStatuses): void {
    // TODO: Implement workshop status change
    // const statusUpdateData = new WorkshopWithStatus(workshop.id, status);
    // if (status === ProviderStatuses.Editing) {
    //   const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
    //     data: { type: ModalConfirmationType.editingWorkshop }
    //   });
    //   dialogRef
    //     .afterClosed()
    //     .pipe(filter(Boolean))
    //     .subscribe((statusReason: string) =>
    //       this.store.dispatch(new UpdateWorkshopStatus({ ...statusUpdateData, statusReason }, this.workshopParameters))
    //     );
    // } else {
    //   this.store.dispatch(new UpdateWorkshopStatus(statusUpdateData, this.workshopParameters));
    // }
  }

  public onDelete(workshop: Workshop): void {
    // TODO: Implement workshop delete
    // const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
    //   width: Constants.MODAL_SMALL,
    //   data: {
    //     type: ModalConfirmationType.deleteWorkshop,
    //     property: workshop.title
    //   }
    // });
    // dialogRef
    //   .afterClosed()
    //   .pipe(filter(Boolean))
    //   .subscribe(() => this.store.dispatch(new DeleteWorkshopById(workshop.id, this.workshopParameters)));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onBlock(workshop: Workshop): void {
    // TODO: Implement state & services & translations for Workshop blocking
    // if (workshop.isBlocked) {
    //   const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
    //     width: Constants.MODAL_SMALL,
    //     data: {
    //       type: ModalConfirmationType.unBlockWorkshop,
    //       property: workshop.title
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe((result: boolean) => {
    //     if (result) {
    //       this.store.dispatch(
    //         new BlockWorkshopById(
    //           {
    //             id: workshop.id,
    //             isBlocked: false
    //           },
    //           this.workshopParameters
    //         )
    //       );
    //     }
    //   });
    // } else {
    //   const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
    //     data: { type: ModalConfirmationType.blockWorkshop }
    //   });
    //   dialogRef.afterClosed().subscribe((result: { reason: string; phoneNumber: string }) => {
    //     if (result) {
    //       this.store.dispatch(
    //         new BlockWorkshopById(
    //           {
    //             id: workshop.id,
    //             isBlocked: true,
    //             blockReason: result.reason,
    //             blockPhoneNumber: result.phoneNumber
    //           },
    //           this.workshopParameters
    //         )
    //       );
    //     }
    //   });
    // }
  }

  public onResetFilters(): void {
    const hasFilter = Object.values(this.filterGroup.controls).some((control: AbstractControl) => Boolean(control.value));
    if (hasFilter) {
      this.searchBarFormControl.reset('', { emitEvent: false });
      this.institutionFormControl.reset('');
      this.regionFormControl.reset('');
      this.areaFormControl.reset('');

      if (!this.isRegionAdmin) {
        this.areaFormControl.disable();
        this.store.dispatch(new ClearCodeficatorSearch());
      }

      this.setInitialWorkshopFilterByDefault();
      this.getWorkshops();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private setInformationDependingOnRole(): void {
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
      this.selectedAdmin$
        .pipe(
          takeUntil(this.destroy$),
          switchMap((admin: RegionAdmin) =>
            this.store
              .dispatch(new GetCodeficatorById(admin.catottgId))
              .pipe(
                switchMap((state) =>
                  this.store.dispatch(new GetCodeficatorSearch(state.metaDataState.codeficator.region, [CodeficatorCategories.Level1]))
                )
              )
          )
        )
        .subscribe((state) => {
          const { id: regionId, category } = state.metaDataState.codeficatorSearch[0];
          if (category === CodeficatorCategories.Region) {
            this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], regionId));
          }
        });
      this.selectedAdmin$
        .pipe(takeUntil(this.destroy$))
        .subscribe((admin: RegionAdmin) =>
          this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], admin.catottgId))
        );
    }
  }

  private subscribeFormControls(): void {
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
        this.workshopParameters.searchString = searchValue;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });

    this.institutionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), takeUntil(this.destroy$), filter(Boolean))
      .subscribe(() => {
        this.workshopParameters.institutionId = this.institutionFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });

    this.regionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), takeUntil(this.destroy$), filter(Boolean))
      .subscribe((value: Codeficator) => {
        this.workshopParameters.catottgId = this.regionFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
        if (value.category === CodeficatorCategories.Region) {
          this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], this.regionFormControl.value.id));
          this.areaFormControl.enable();
        } else {
          this.store.dispatch(new ClearCodeficatorSearch());
          this.areaFormControl.disable();
        }
      });

    this.areaFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), takeUntil(this.destroy$), filter(Boolean))
      .subscribe(() => {
        this.workshopParameters.catottgId = this.areaFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });
  }

  private setInitialWorkshopFilterByDefault(): void {
    this.workshopParameters.searchString = '';
    this.workshopParameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;
    this.setWorkshopFiltersByDefault(this.workshopParameters);
  }

  private getWorkshops(): void {
    Util.setFromPaginationParam(this.workshopParameters, this.currentPage, this.totalEntities);
    this.getWorkshopsByFilter.emit(this.workshopParameters);
  }
}

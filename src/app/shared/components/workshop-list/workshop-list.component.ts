import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, filter, map, Observable, of, skip, startWith, Subject, switchMap, takeUntil } from 'rxjs';

import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { DraftStatusEnum, FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { OwnershipTypes } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { UserStatusIcons } from 'shared/enum/statuses';
import { BaseAdmin } from 'shared/models/admin.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { Institution } from 'shared/models/institution.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopDraft, WorkshopFilterAdministration } from 'shared/models/workshop.model';
import {
  ApproveWorkshopDraft,
  GetAreaAdminProfile,
  GetMinistryAdminProfile,
  GetRegionAdminProfile,
  RejectWorkshopDraft
} from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { FilterState } from 'shared/store/filter.state';
import { ClearCodeficatorSearch, GetAllInstitutions, GetCodeficatorById, GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { GetProfile } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { ReasonModalWindowComponent } from '../confirmation-modal-window/reason-modal-window/reason-modal-window.component';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
})
export class WorkshopListComponent implements OnInit, OnDestroy {
  @Input() public setWorkshopFiltersByDefault: (
    workshopParameters: WorkshopFilterAdministration,
    role: Role,
    selectedAdmin: BaseAdmin
  ) => void;

  @Output() public getWorkshopsByFilter: EventEmitter<WorkshopFilterAdministration> = new EventEmitter();

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
  public readonly modeConstants = ModeConstants;
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly ownershipTypeEnum = OwnershipTypesEnum;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly statusIcons = UserStatusIcons;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly workshopDraftStatus = WorkshopDraftStatus;
  public readonly workshopDraftStatusTitles = DraftStatusEnum;
  public readonly workshopStatusesToFilter = ['PendingModeration', 'EditedByModerator'];
  public readonly displayedColumns: string[] = [
    'title',
    'providerTitle',
    'providerOwnership',
    // 'formOfLearning',
    // 'seats',
    'providerEdrpou',
    'directorPosition',
    'directorFullName',
    'isPaid',
    'status',
    'actions'
  ];
  public workshopParameters: WorkshopFilterAdministration = {};
  public dataSource = new MatTableDataSource<WorkshopDraft>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;

  public selectedAdmin: BaseAdmin;
  public role: Role;
  public workshop: Workshop;
  public selectedWorkshopDraftId: string;
  public isInfoDisplayed: boolean;
  public filterGroup: FormGroup;
  public isLoading: boolean;
  public totalEntities: number;
  public regions$: Observable<Codeficator[]>;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    protected readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly matDialog: MatDialog,
    private readonly formBuilder: FormBuilder
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

  private get statusFormControl(): FormControl {
    return this.filterGroup.get('workshopDraftStatuses') as FormControl;
  }

  @Input()
  public set workshops(value: SearchResponse<WorkshopDraft[]>) {
    this.dataSource.data = value?.entities;
    this.totalEntities = value?.totalAmount;
  }

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  public ngOnInit(): void {
    this.selectedAdmin$.pipe(takeUntil(this.destroy$)).subscribe((admin: BaseAdmin) => (this.selectedAdmin = admin));

    this.role$
      .pipe(
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
              return of(null);
            case Role.provider:
              return this.store.dispatch(new GetProfile());
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setInitialWorkshopFilterByDefault();
        this.getWorkshops();
      });

    this.isLoadingCabinet$.pipe(takeUntil(this.destroy$)).subscribe((isLoadingCabinet) => {
      this.isLoading = isLoadingCabinet;
    });

    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.WorkshopDrafts,
        isActive: false,
        disable: true
      })
    );

    this.filterGroup = this.formBuilder.group({
      searchBarFilter: new FormControl(''),
      institution: new FormControl(''),
      region: new FormControl(''),
      area: new FormControl(''),
      workshopDraftStatuses: new FormControl('')
    });

    this.setInformationDependingOnRole();
    this.subscribeFormControls();
  }

  public onViewWorkshopInfo(workshop: WorkshopDraft): void {
    this.selectedWorkshopDraftId = workshop.workshopDraftId;
    this.workshop = workshop.workshopDetails;
    this.isInfoDisplayed = true;
  }

  public onRejectDraft(workshop: WorkshopDraft): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.editingWorkshop }
    });
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((statusReason: string) => this.store.dispatch(new RejectWorkshopDraft(workshop.workshopDraftId, statusReason)));
  }

  public onApproveDraft(workshop: WorkshopDraft): void {
    this.store.dispatch(new ApproveWorkshopDraft(workshop.workshopDraftId));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onResetFilters(): void {
    const hasFilter = Object.values(this.filterGroup.controls).some((control: AbstractControl) => Boolean(control.value));
    if (hasFilter) {
      this.searchBarFormControl.reset('', { emitEvent: false });
      this.institutionFormControl.reset('');
      this.regionFormControl.reset('');
      this.areaFormControl.reset('');
      this.statusFormControl.reset('');

      if (!this.isRegionAdmin) {
        this.areaFormControl.disable();
        this.store.dispatch(new ClearCodeficatorSearch());
      }

      this.setInitialWorkshopFilterByDefault();
      this.getWorkshops();
    }
  }

  public closeInfo(): void {
    this.isInfoDisplayed = false;
    this.selectedWorkshopDraftId = null;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private setInformationDependingOnRole(): void {
    if (this.isTechAdmin || this.isModerator) {
      this.store.dispatch(new GetAllInstitutions(true));
    }
    if (this.isTechAdmin || this.isMinistryAdmin || this.isModerator) {
      this.regions$ = this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.Level1])).pipe(
        map((state) => [...state.metaDataState.codeficatorSearch]),
        takeUntil(this.destroy$)
      );
      this.areaFormControl.disable();
    }
    if (this.isRegionAdmin) {
      this.selectedAdmin$
        .pipe(
          filter((admin: RegionAdmin) => Boolean(admin)),
          switchMap((admin: RegionAdmin) =>
            this.store
              .dispatch(new GetCodeficatorById(admin.catottgId))
              .pipe(
                switchMap((state) =>
                  this.store.dispatch(new GetCodeficatorSearch(state.metaDataState.codeficator.region, [CodeficatorCategories.Level1]))
                )
              )
          ),
          takeUntil(this.destroy$)
        )
        .subscribe((state) => {
          const { id: regionId, category } = state.metaDataState.codeficatorSearch[0];
          if (category === CodeficatorCategories.Region) {
            this.store.dispatch(new GetCodeficatorSearch('', [CodeficatorCategories.TerritorialCommunity], regionId));
          }
        });
      this.selectedAdmin$
        .pipe(filter(Boolean), takeUntil(this.destroy$))
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
        map((value: string) => value.trim()),
        takeUntil(this.destroy$)
      )
      .subscribe((searchValue: string) => {
        this.workshopParameters.searchString = searchValue;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });

    this.institutionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), filter(Boolean), takeUntil(this.destroy$))
      .subscribe(() => {
        this.workshopParameters.institutionId = this.institutionFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });

    this.regionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), filter(Boolean), takeUntil(this.destroy$))
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
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), filter(Boolean), takeUntil(this.destroy$))
      .subscribe(() => {
        this.workshopParameters.catottgId = this.areaFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getWorkshops();
      });

    this.statusFormControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      this.workshopParameters.workshopDraftStatuses = this.statusFormControl.value;
      this.currentPage = PaginationConstants.firstPage;
      this.getWorkshops();
    });
  }

  private setInitialWorkshopFilterByDefault(): void {
    this.workshopParameters.searchString = '';
    this.workshopParameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;
    this.setWorkshopFiltersByDefault(this.workshopParameters, this.role, this.selectedAdmin);
  }

  private getWorkshops(): void {
    Util.setFromPaginationParam(this.workshopParameters, this.currentPage, this.totalEntities);
    this.getWorkshopsByFilter.emit(this.workshopParameters);
  }
}

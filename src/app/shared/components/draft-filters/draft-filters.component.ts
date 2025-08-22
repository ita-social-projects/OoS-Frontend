import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, takeUntil, switchMap, of, Subject, debounceTime, distinctUntilChanged, filter, map, skip, startWith } from 'rxjs';
import { PaginationConstants } from 'shared/constants/constants';
import { CodeficatorCategories } from 'shared/enum/codeficator-categories';
import { DraftStatusEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { BaseAdmin } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { CompetitionFilterAdministration } from 'shared/models/competition.model';
import { Institution } from 'shared/models/institution.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { GetMinistryAdminProfile, GetRegionAdminProfile, GetAreaAdminProfile } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { FilterState } from 'shared/store/filter.state';
import { GetAllInstitutions, GetCodeficatorSearch, GetCodeficatorById, ClearCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { GetProfile } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-draft-filters',
  templateUrl: './draft-filters.component.html',
  styleUrl: './draft-filters.component.scss'
})
export class DraftFiltersComponent implements OnInit, OnDestroy {
  @Input() public currentPage: PaginationElement = PaginationConstants.firstPage;
  @Output() public getDraftsByFilter: EventEmitter<{
    parameters: CompetitionFilterAdministration | WorkshopFilterAdministration;
    currentPage: PaginationElement;
  }> = new EventEmitter();
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(AdminState.selectedAdmin)
  public selectedAdmin$: Observable<BaseAdmin>;
  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(FilterState.settlement)
  public settlement$: Observable<Codeficator>;
  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;

  public readonly workshopDraftStatusTitles = DraftStatusEnum;
  public selectedAdmin: BaseAdmin;
  public filterGroup: FormGroup;
  public role: Role;

  // TO DO Make one parameters object for both competitions and workshops
  public parameters: CompetitionFilterAdministration & WorkshopFilterAdministration = {};
  public regions$: Observable<Codeficator[]>;

  public readonly workshopStatusesToFilter = ['PendingModeration', 'EditedByModerator'];
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly store: Store,
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
        this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
      });

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

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public setFiltersByDefault(parameters: CompetitionFilterAdministration, role: Role, selectedAdmin?: BaseAdmin): void {
    parameters.searchString = '';
    parameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;

    switch (role) {
      case Role.techAdmin:
      case Role.moderator:
        parameters.institutionId = '';
        parameters.catottgId = 0;
        break;
      case Role.ministryAdmin:
        parameters.institutionId = selectedAdmin.institutionId;
        parameters.catottgId = 0;
        break;
      case Role.regionAdmin:
      case Role.areaAdmin:
        parameters.institutionId = selectedAdmin.institutionId;
        parameters.catottgId = (selectedAdmin as RegionAdmin | AreaAdmin).catottgId;
        break;
    }
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
      this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
    }
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
        this.parameters.searchString = searchValue;
        this.currentPage = PaginationConstants.firstPage;
        this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
      });

    this.institutionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), filter(Boolean), takeUntil(this.destroy$))
      .subscribe(() => {
        this.parameters.institutionId = this.institutionFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
      });

    this.regionFormControl.valueChanges
      .pipe(distinctUntilChanged(), startWith(''), skip(1), debounceTime(1000), filter(Boolean), takeUntil(this.destroy$))
      .subscribe((value: Codeficator) => {
        this.parameters.catottgId = this.regionFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
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
        this.parameters.catottgId = this.areaFormControl.value.id;
        this.currentPage = PaginationConstants.firstPage;
        this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
      });

    this.statusFormControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(1000), takeUntil(this.destroy$)).subscribe(() => {
      // TO DO Change statuses when it will be unified
      this.parameters.competitiveEventDraftStatuses = this.statusFormControl.value;
      this.parameters.workshopDraftStatuses = this.statusFormControl.value;
      this.currentPage = PaginationConstants.firstPage;
      this.getDraftsByFilter.emit({ parameters: this.parameters, currentPage: this.currentPage });
    });
  }

  private setInitialWorkshopFilterByDefault(): void {
    this.parameters.searchString = '';
    this.parameters.size = PaginationConstants.TABLE_ITEMS_PER_PAGE;
    this.setFiltersByDefault(this.parameters, this.role, this.selectedAdmin);
  }
}

import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WorkshopDeclination } from '../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../shared/enum/navigation-bar';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { AppState } from '../../shared/store/app.state';
import { GetFilteredWorkshops, ResetFilteredWorkshops, SetMapView, SetFilterFromURL, FilterClear } from '../../shared/store/filter.actions';
import { FilterState } from '../../shared/store/filter.state';
import { FiltersSidenavToggle, AddNavPath, DeleteNavPath } from '../../shared/store/navigation.actions';
import { NavigationState } from '../../shared/store/navigation.state';
import { SetWorkshopsPerPage } from '../../shared/store/paginator.actions';
import { PaginatorState } from '../../shared/store/paginator.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { SearchResponse } from '../../shared/models/search.model';
import { Util } from '../../shared/utils/utils';
import { DefaultFilterFormState } from 'src/app/shared/models/defaultFilterFormState.model';

enum ViewType {
  map = 'map',
  list = 'list'
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly WorkshopDeclination = WorkshopDeclination;

  @Select(AppState.isMobileScreen)
  isMobileView$: Observable<boolean>;
  isMobileView: boolean;
  @Select(FilterState.filteredWorkshops)
  filteredWorkshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Select(FilterState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  role: string;
  @Select(PaginatorState.workshopsPerPage)
  workshopsPerPage$: Observable<number>;
  workshopsPerPage: number;
  @Select(PaginatorState.currentPage)
  currentPage$: Observable<number>;
  currentPage: number;
  @Select(NavigationState.filtersSidenavOpenTrue)
  isFiltersSidenavOpen$: Observable<boolean>;
  isFiltersSidenavOpen: boolean;
  @Select(FilterState.isMapView)
  isMapView$: Observable<boolean>;
  isMapView: boolean;
  @Select(FilterState.filterForm)
  filterForm$: Observable<DefaultFilterFormState>;

  currentView: ViewType = ViewType.list;
  viewType = ViewType;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private navigationBarService: NavigationBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isMapView = this.store.selectSnapshot(FilterState.isMapView);

    this.addNavPath();
    this.setInitialSubscriptions();
  }

  ngAfterViewInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((queryParamMap: ParamMap) => {
      this.getWorkshopsFromURL(queryParamMap);
    });

    this.filterForm$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((filterForm: DefaultFilterFormState) => {
      this.setURLFromFilterForm(filterForm);
    });
  }

  private setInitialSubscriptions(): void {
    combineLatest([this.currentPage$, this.workshopsPerPage$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([currentPage, workshopsPerPage]) => {
        this.currentPage = currentPage;
        this.workshopsPerPage = workshopsPerPage;
      });

    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: string) => (this.role = role));

    this.isMapView$.pipe(skip(1), takeUntil(this.destroy$)).subscribe((isMapView: boolean) => {
      const filterForm = this.store.selectSnapshot(FilterState.filterForm);
      let queryParamMap: ParamMap;

      this.isMapView = isMapView;
      this.setURLFromFilterForm(filterForm);

      queryParamMap = this.route.snapshot.queryParamMap;
      this.getWorkshopsFromURL(queryParamMap);
    });

    this.isMobileView$.pipe(takeUntil(this.destroy$)).subscribe((isMobileView: boolean) => {
      this.isMobileView = isMobileView;

      if (!this.isMobileView) {
        this.store.dispatch(new FiltersSidenavToggle(true));
      }
    });

    this.isFiltersSidenavOpen$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isFiltersSidenavOpen = val));
  }

  private addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          name: NavBarName.WorkshopResult,
          isActive: false,
          disable: true
        })
      )
    );
  }

  private getWorkshopsFromURL(queryParamMap: ParamMap): void {
    const filterParams = queryParamMap.get('filter');
    this.store.dispatch(new SetFilterFromURL(Util.parseFilterStateQuery(filterParams)));
  }

  /**
   * Updates / Appends workshop filter to the URL query string
   * @private
   */
  private setURLFromFilterForm(filterForm: Partial<DefaultFilterFormState>): void {
    // Set Filter param as null to remove it from URL query string
    const filterQueryParams = Util.getFilterStateQuery(filterForm) || null;
    this.router.navigate([`result/${this.currentView}`], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
  }

  viewHandler(value: ViewType): void {
    this.currentView = value;
    this.store.dispatch(new SetMapView(this.currentView === this.viewType.map));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetWorkshopsPerPage(itemsPerPage), new GetFilteredWorkshops()]);
  }

  filterHandler(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.isFiltersSidenavOpen));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch([new DeleteNavPath(), new ResetFilteredWorkshops(), new FilterClear()]);
  }
}

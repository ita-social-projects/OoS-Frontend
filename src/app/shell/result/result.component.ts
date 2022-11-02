import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Actions, Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationStart, ParamMap } from '@angular/router';
import { WorkshopDeclination } from '../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../shared/enum/navigation-bar';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { AppState } from '../../shared/store/app.state';
import {
  FilterClear,
  GetFilteredWorkshops,
  ResetFilteredWorkshops, SetFilterFromURL
} from '../../shared/store/filter.actions';
import { FilterState } from '../../shared/store/filter.state';
import {
  FiltersSidenavToggle,
  AddNavPath,
  DeleteNavPath
} from '../../shared/store/navigation.actions';
import { NavigationState } from '../../shared/store/navigation.state';
import { SetWorkshopsPerPage } from '../../shared/store/paginator.actions';
import { PaginatorState } from '../../shared/store/paginator.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { SearchResponse } from '../../shared/models/search.model';
import { Util } from '../../shared/utils/utils';

enum ViewType {
  map = 'map',
  list = 'list'
}

interface FilterClearInterface {
  directionIds: any
  maxAge: number
  minAge: number
  isAppropriateAge: boolean
  startTime: number
  endTime: number
  workingDays: any
  isFree: boolean
  isPaid: boolean
  maxPrice: number
  minPrice: number
  statuses: any
  searchQuery: string
  order: string
  withDisabilityOption: boolean
  isStrictWorkdays: boolean
  isAppropriateHours: boolean
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
  @Select(FilterState)
    filterState$: Observable<any>;
  filterState: any;

  currentView: ViewType = ViewType.list;
  viewType = ViewType;
  destroy$: Subject<boolean> = new Subject<boolean>();

  filterQuery$: Observable<string>;

  constructor(
    private actions$: Actions,
    private store: Store,
    private navigationBarService: NavigationBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.route.queryParamMap.pipe(tap((params: ParamMap) => {
        const filterParams = params.get('filter');
        if (filterParams) {
          this.store.dispatch(new SetFilterFromURL(Util.parseFilterStateQuery(filterParams)));
        }
        else {
          // eslint-disable-next-line no-console
          console.info('params is null');
        }
      }))
  }

  ngOnInit(): void {
    this.addNavPath();
    this.getWorkshops();
    this.setInitialSubscribtions();
  }

  ngAfterViewInit(): void {
    this.setFilterStateURLParams();
  }

  private setInitialSubscribtions(): void {
    combineLatest([
      this.isMobileView$,
      this.role$,
      this.route.params,
      this.currentPage$,
      this.workshopsPerPage$,
      this.isMapView$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          isMobileView,
          role,
          params,
          currentPage,
          workshopsPerPage,
          isMapView
        ]) => {
          this.isMobileView = isMobileView;
          this.role = role;
          this.currentView = params.param;
          this.currentPage = currentPage;
          this.workshopsPerPage = workshopsPerPage;
          this.isMapView = isMapView;
          if (!this.isMobileView) {
            this.store.dispatch(new FiltersSidenavToggle(true));
          }
        }
      );

    this.isFiltersSidenavOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => (this.isFiltersSidenavOpen = val));
  }

  private getWorkshops(): void {
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          this.store.dispatch(new GetFilteredWorkshops(this.isMapView));
        }
      });
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

  private setFilterStateURLParams(): void {
    this.filterState$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((val ) => {
        this.filterState = val;
        const filterQueryParams = Util.getFilterStateQuery(this.filterState);
        if (filterQueryParams === '') {
          this.router.navigate([], { queryParams: {filter: null}, replaceUrl: true });
        } else if (this.router.url.includes('result/list')) { // check if at that current moment url is still result/list
          this.router.navigate([], { queryParams: {filter: filterQueryParams}, replaceUrl: true });
        }
      });
  }

  viewHandler(value: ViewType): void {
    this.store
      .dispatch(new GetFilteredWorkshops(this.isMapView))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate([`result/${value}`]));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([
      new SetWorkshopsPerPage(itemsPerPage),
      new GetFilteredWorkshops()
    ]);
  }

  filterHandler(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.isFiltersSidenavOpen));
  }

  ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetFilteredWorkshops(), new FilterClear()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.router.navigate([], { queryParams: null});
  }
}

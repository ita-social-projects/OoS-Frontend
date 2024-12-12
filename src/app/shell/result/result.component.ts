import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ResultViewType } from 'shared/enum/result-view-type';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AppState } from 'shared/store/app.state';
import { FilterClear, ResetFilteredWorkshops, SetFilterFromURL, SetFilterPagination, SetMapView } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { AddNavPath, DeleteNavPath, FiltersSidenavToggle } from 'shared/store/navigation.actions';
import { NavigationState } from 'shared/store/navigation.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(FilterState.filteredWorkshops)
  public filteredWorkshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Select(AppState.isMobileScreen)
  private isMobileView$: Observable<boolean>;
  @Select(RegistrationState.role)
  private role$: Observable<string>;
  @Select(NavigationState.filtersSidenavOpenTrue)
  private isFiltersSidenavOpen$: Observable<boolean>;
  @Select(FilterState.isMapView)
  private isMapView$: Observable<boolean>;
  @Select(FilterState)
  private filterState$: Observable<FilterStateModel>;

  public readonly ResultViewType = ResultViewType;
  public readonly WorkshopDeclination = WorkshopDeclination;

  public isMobileView: boolean;
  public role: string;
  public isFiltersSidenavOpen: boolean;
  public isMapView: boolean;
  public currentViewType: ResultViewType;
  public paginationParameters: PaginationParameters = {
    size: PaginationConstants.WORKSHOPS_PER_PAGE,
    from: 0
  };
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public marginLeft: string = '0';
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private navigationBarService: NavigationBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    this.calculateMarginLeft();
  }

  public ngOnInit(): void {
    this.store.dispatch(new SetFilterPagination(this.paginationParameters));

    this.addNavPath();
    this.setViewType();
    this.setInitialSubscriptions();
    this.setFiltersFromQueryParamsWhenMapView();
    this.calculateMarginLeft();
  }

  public ngAfterViewInit(): void {
    this.setFilterStateURLParams();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetFilteredWorkshops(), new FilterClear()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public calculateMarginLeft(): void {
    if (this.isFiltersSidenavOpen) {
      this.marginLeft = window.innerWidth < 900 ? '250px' : '340px';
    } else {
      this.marginLeft = '0';
    }
  }

  public viewHandler(value: ResultViewType): void {
    this.currentViewType = value;
    this.store.dispatch(new SetMapView(this.currentViewType === ResultViewType.Map));
  }

  public filterHandler(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.isFiltersSidenavOpen));
    this.isFiltersSidenavOpen = !this.isFiltersSidenavOpen;
    this.calculateMarginLeft();
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

  private setViewType(): void {
    this.currentViewType = this.route.snapshot.paramMap.get('param') as ResultViewType;

    if (this.currentViewType === ResultViewType.Map) {
      this.store.dispatch(new SetMapView(true));
    }
  }

  private setInitialSubscriptions(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: string) => (this.role = role));

    this.isMobileView$.pipe(takeUntil(this.destroy$)).subscribe((isMobileView: boolean) => {
      this.isMobileView = isMobileView;

      if (!this.isMobileView) {
        this.store.dispatch(new FiltersSidenavToggle(true));
      }
    });

    this.isFiltersSidenavOpen$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.isFiltersSidenavOpen = val;
      this.calculateMarginLeft();
    });
  }

  private setFiltersFromQueryParamsWhenMapView(): void {
    combineLatest([this.route.queryParamMap, this.isMapView$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([queryParamMap, isMapView]: [ParamMap, boolean]) => {
        const filterParams = queryParamMap.get('filter');
        this.currentPage = { element: 1, isActive: true };
        this.isMapView = isMapView;
        this.store.dispatch(new SetFilterFromURL(Util.parseFilterStateQuery(filterParams)));
      });
  }

  private setFilterStateURLParams(): void {
    this.filterState$.pipe(takeUntil(this.destroy$)).subscribe((filterState: FilterStateModel) => {
      const filterQueryParams = Util.getFilterStateQuery(filterState) || null;
      if (this.router.url.startsWith('/result')) {
        this.router.navigate([`result/${this.currentViewType}`], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
      }
    });
  }
}

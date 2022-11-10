import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { WorkshopDeclination } from '../../shared/enum/enumUA/declinations/declination';
import { NavBarName } from '../../shared/enum/navigation-bar';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { AppState } from '../../shared/store/app.state';
import { GetFilteredWorkshops, ResetFilteredWorkshops, SetMapView } from '../../shared/store/filter.actions';
import { FilterState } from '../../shared/store/filter.state';
import { FiltersSidenavToggle, AddNavPath, DeleteNavPath } from '../../shared/store/navigation.actions';
import { NavigationState } from '../../shared/store/navigation.state';
import { SetWorkshopsPerPage } from '../../shared/store/paginator.actions';
import { PaginatorState } from '../../shared/store/paginator.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { SearchResponse } from '../../shared/models/search.model';

enum ViewType {
  map = 'map',
  list = 'list'
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
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

  currentView: ViewType = ViewType.list;
  viewType = ViewType;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private actions$: Actions,
    private store: Store,
    private navigationBarService: NavigationBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addNavPath();
    this.getWorkshops();
    this.setInitialSubscribtions();
  }

  private setInitialSubscribtions(): void {
    combineLatest([this.isMobileView$, this.role$, this.route.params, this.currentPage$, this.workshopsPerPage$, this.isMapView$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobileView, role, params, currentPage, workshopsPerPage, isMapView]) => {
        this.isMobileView = isMobileView;
        this.role = role;
        this.currentView = params.param;
        this.store.dispatch(new SetMapView(this.currentView === this.viewType.map));
        this.currentPage = currentPage;
        this.workshopsPerPage = workshopsPerPage;
        this.isMapView = isMapView;
        if (!this.isMobileView) {
          this.store.dispatch(new FiltersSidenavToggle(true));
        }
      });

    this.isFiltersSidenavOpen$.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isFiltersSidenavOpen = val));
  }

  private getWorkshops(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: NavigationStart) => {
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

  viewHandler(value: ViewType): void {
    this.store
      .dispatch(new GetFilteredWorkshops(this.isMapView))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate([`result/${value}`]));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetWorkshopsPerPage(itemsPerPage), new GetFilteredWorkshops()]);
  }

  filterHandler(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.isFiltersSidenavOpen));
  }

  ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetFilteredWorkshops()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

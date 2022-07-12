import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, Select, Store, ofActionCompleted } from '@ngxs/store';
import { AddNavPath, DeleteNavPath, FiltersSidenavToggle } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { FilterChange, GetFilteredWorkshops, ResetFilteredWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AppState } from 'src/app/shared/store/app.state';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { SetFirstPage, SetWorkshopsPerPage } from 'src/app/shared/store/paginator.actions';
import { NavigationState } from 'src/app/shared/store/navigation.state';

enum ViewType {
  map = 'map',
  data = 'list',
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy {
  readonly WorkshopDeclination = WorkshopDeclination;

  @Select(AppState.isMobileScreen)
  isMobileView$: Observable<boolean>;
  isMobileView: boolean;
  @Select(FilterState.filteredWorkshops)
  filteredWorkshops$: Observable<WorkshopFilterCard>;
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
  filtersSidenavOpenTrue$: Observable<boolean>;
  visibleFiltersSidenav: boolean;

  currentView: ViewType = ViewType.data;
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
    combineLatest([
      this.isMobileView$, 
      this.role$, 
      this.route.params, 
      this.filtersSidenavOpenTrue$, 
      this.currentPage$, 
      this.workshopsPerPage$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([
        isMobileView, 
        role, params, 
        visibleFiltersSidenav, 
        currentPage, 
        workshopsPerPage
      ]) => {
        this.isMobileView = isMobileView;
        this.role = role;
        this.currentView = params.param;
        this.visibleFiltersSidenav = visibleFiltersSidenav;
        this.currentPage = currentPage;
        this.workshopsPerPage = workshopsPerPage;
        if (!this.isMobileView) {
          this.store.dispatch(new FiltersSidenavToggle(true));
        }
      });

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        this.store.dispatch(new GetFilteredWorkshops(this.currentView === this.viewType.map));
      }
    });

    this.actions$
      .pipe(ofActionCompleted(FilterChange))
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() =>
        this.store.dispatch([new SetFirstPage(), new GetFilteredWorkshops(this.currentView === this.viewType.map)])
      );
  }

  private addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createOneNavPath({
          name: NavBarName.WorkshopResult,
          isActive: false,
          disable: true,
        })
      )
    );
  }

  viewHandler(value: ViewType): void {
    this.store
      .dispatch(new GetFilteredWorkshops(value === this.viewType.map))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate([`result/${value}`]));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetWorkshopsPerPage(itemsPerPage), new GetFilteredWorkshops()]);
  }

  filterHandler(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.visibleFiltersSidenav));
  }

  ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetFilteredWorkshops()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

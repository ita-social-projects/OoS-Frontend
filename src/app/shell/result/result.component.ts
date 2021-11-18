import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable, Subject } from 'rxjs';
import { WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { FilterChange, GetFilteredWorkshops, SetFirstPage } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AppState } from 'src/app/shared/store/app.state';
import { Util } from 'src/app/shared/utils/utils';
import { Constants } from 'src/app/shared/constants/constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { ResetSelectedWorkshop } from 'src/app/shared/store/user.actions';

enum ViewType {
  map = 'map',
  data = 'list'
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  @Select(FilterState.filterList)
  filterList$: Observable<any>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  @Select(FilterState.filteredWorkshops)
  filteredWorkshops$: Observable<WorkshopFilterCard>;
  @Select(FilterState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(RegistrationState.role)
  role$: Observable<string>;

  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;
  public currentView: ViewType = ViewType.data;
  public isFiltersVisible = true;
  public viewType = ViewType;

  public destroy$: Subject<boolean> = new Subject<boolean>();

  public filtersList;
  public currentPage;
  public order;

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.isFiltersVisible = window.innerWidth > 750;
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    public navigationBarService: NavigationBarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
      this.currentView = (params.param === this.viewType.map) ? this.viewType.map : this.viewType.data;
    });

    this.store.dispatch([
      new AddNavPath(this.navigationBarService.creatOneNavPath(
        { name: NavBarName.TopWorkshops, isActive: false, disable: true }
      )),
      new GetFilteredWorkshops(this.currentView === this.viewType.map)
    ]);

    this.actions$.pipe(ofAction(FilterChange))
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch([
          new SetFirstPage(),
          new ResetSelectedWorkshop(),
          new GetFilteredWorkshops(this.currentView === this.viewType.map)
        ]));

    this.isFiltersVisible = window.innerWidth > 750;

    this.filterList$
      .pipe(
        takeUntil(this.destroy$)
    ).subscribe((list) => {
        const {withDisabilityOption,ageFilter,categoryCheckBox,priceFilter,workingHours,currentPage,order} = list;
        this.currentPage = currentPage;
        this.filtersList = {withDisabilityOption,ageFilter,categoryCheckBox,priceFilter,workingHours};
        this.order = order;
    })

  }

  viewHandler(value: ViewType): void {
    this.store.dispatch(new GetFilteredWorkshops(value === this.viewType.map))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate([`result/${value}`]));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

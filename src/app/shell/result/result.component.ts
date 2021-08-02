import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable, Subject } from 'rxjs';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { FilterChange, GetFilteredWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

enum ViewType {
  map = "map",
  data = "show-data"
}
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {

  @Select(FilterState.filteredWorkshops) filteredWorkshops$: Observable<WorkshopCard[]>;

  public currentView: string = ViewType.data;
  isFiltersVisible: boolean = true;
  viewType = ViewType;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private actions$: Actions,
    private store: Store,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {

    this.store.dispatch(
      new AddNavPath(this.navigationBarService.creatOneNavPath(
        { name: NavBarName.TopWorkshops, isActive: false, disable: true }
      )),
    );

    this.actions$.pipe(ofAction(FilterChange))
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetFilteredWorkshops()));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

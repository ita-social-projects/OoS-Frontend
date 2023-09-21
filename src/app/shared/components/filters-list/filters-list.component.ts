import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FilterClear,
  SetClosedRecruitment,
  SetOpenRecruitment,
  SetWithDisabilityOption,
} from '../../store/filter.actions';
import { FilterState } from '../../store/filter.state';
import { FiltersSidenavToggle } from '../../store/navigation.actions';
import { FilterList } from '../../models/filterList.model';
import { NavigationState } from '../../store/navigation.state';
import { WorkshopOpenStatus } from '../../enum/workshop';

@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit, OnDestroy {
  @Select(FilterState.filterList)
  public filterList$: Observable<FilterList>;
  public filterList: FilterList;

  @Select(NavigationState.filtersSidenavOpenTrue)
  public filtersSidenavOpenTrue$: Observable<boolean>;
  public visibleFiltersSidenav: boolean;

  @Select(FilterState.isMapView)
  public isMapView$: Observable<boolean>;

  @Input() public isMobileView: boolean;

  public OpenRecruitmentControl = new FormControl(false);
  public ClosedRecruitmentControl = new FormControl(false);
  public WithDisabilityOptionControl = new FormControl(false);
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public statuses: WorkshopOpenStatus[];
  public readonly workhopStatus = WorkshopOpenStatus;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    combineLatest([this.filtersSidenavOpenTrue$, this.filterList$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([visibleFiltersSidenav, filterList]) => {
        this.visibleFiltersSidenav = visibleFiltersSidenav;
        this.filterList = filterList;
        this.statuses = filterList.statuses;
        this.WithDisabilityOptionControl.setValue(filterList.withDisabilityOption, { emitEvent: false });
      });

    this.OpenRecruitmentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.statusHandler(val, this.workhopStatus.Open);
      this.store.dispatch(new SetOpenRecruitment(this.statuses));
    });

    this.ClosedRecruitmentControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => {
      this.statusHandler(val, this.workhopStatus.Closed);
      this.store.dispatch(new SetClosedRecruitment(this.statuses));
    });

    this.WithDisabilityOptionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));
  }

  /**
   * When the user selects filters (OpenRecruitment or ClosedRecruitment),
   * we add the status to the array or remove the status from the array.
   */
  public statusHandler(val: boolean, status: string): void {
    val ? this.statuses.push(this.workhopStatus[status]) : this.statuses.splice(this.statuses.indexOf(this.workhopStatus[status]), 1);
  }

  public changeView(): void {
    this.store.dispatch(new FiltersSidenavToggle(!this.visibleFiltersSidenav));
  }

  public onFilterReset(): void {
    this.store.dispatch(new FilterClear());
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

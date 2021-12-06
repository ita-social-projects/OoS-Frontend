import { SetWithDisabilityOption } from './../../store/filter.actions';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterChange, FilterClear, SetClosedRecruitment, SetOpenRecruitment } from '../../store/filter.actions';
import { FilterState } from '../../store/filter.state';
import { AppState } from '../../store/app.state';
import { FiltersSidenavToggle } from '../../store/navigation.actions';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit, OnDestroy {

  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  @Select(FilterState.filterList)
  @Input()
  set filtersList(filters) {
    const {withDisabilityOption,ageFilter,categoryCheckBox,priceFilter,workingHours} = filters
    this.priceFilter = priceFilter;
    this.workingHours = workingHours;
    this.categoryCheckBox = categoryCheckBox;
    this.ageFilter = ageFilter;
    this.WithDisabilityOptionControl.setValue(withDisabilityOption,{emitEvent:false})
  };

  public priceFilter;
  public workingHours;
  public categoryCheckBox;
  public ageFilter;

  OpenRecruitmentControl = new FormControl(false);
  ClosedRecruitmentControl = new FormControl(false);
  WithDisabilityOptionControl = new FormControl(false);

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {

    this.OpenRecruitmentControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetOpenRecruitment(val)));

    this.ClosedRecruitmentControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetClosedRecruitment(val)));

    this.WithDisabilityOptionControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((val: boolean) => this.store.dispatch(new SetWithDisabilityOption(val)));

  }

  changeView(): void {
    this.store.dispatch(new FiltersSidenavToggle());
  }

  onFilterReset(): void {
    this.store.dispatch([new FilterClear(), new FilterChange()])
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { setMinAge } from 'src/app/shared/store/filter.actions';
import { FilterStateModel } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {

  

  @Select() filter$: Observable<FilterStateModel>;

  unsubscribe$: Subject<void> = new Subject;

  showModalFilter = false;
  minAge = null;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.filter$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      res => { this.minAge = res.ageFrom}
    )
  }

  setMinAge(age: number){
    this.store.dispatch(new setMinAge(age))
  }

  toggleModalFilter(): void{
    this.showModalFilter = !this.showModalFilter;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

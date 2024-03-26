import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { FilterChange, SetRadiusSize } from 'shared/store/filter.actions';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-radius-set',
  templateUrl: './user-radius-set.component.html',
  styleUrls: ['./user-radius-set.component.scss']
})
export class UserRadiusSetComponent implements OnInit, OnDestroy {
  public defaultRadiusInKm = 5;
  public options = { floor: 2, ceil: 10 };
  public currentRadius: FormControl = new FormControl({
    value: '',
    disabled: true
  });

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.setValue(this.defaultRadiusInKm);
    this.currentRadius.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new FilterChange()));
  }

  radiusHandler(event: ChangeContext): void {
    event.pointerType && this.setValue(event.highValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setValue(kilometers: number): void {
    this.currentRadius.setValue(kilometers);
    this.store.dispatch(new SetRadiusSize(kilometers));
  }
}

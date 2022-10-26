import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import {
  GetFilteredWorkshops,
  SetRadiusSize
} from '../../../store/filter.actions';
import { DestroyableDirective } from '../../../directives/destroyable.directive';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-radius-set',
  templateUrl: './user-radius-set.component.html',
  styleUrls: ['./user-radius-set.component.scss']
})
export class UserRadiusSetComponent implements OnInit, OnDestroy {
  public defaultValue = 5;
  public options = { floor: 2, ceil: 10 };
  public currentRadius: FormControl = new FormControl({
    value: '',
    disabled: true
  });

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.setValue(this.defaultValue);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public radiusHandler(event: ChangeContext): void {
    event.pointerType && this.setValue(event.highValue);
  }

  private setValue(num: number): void {
    this.currentRadius.setValue(num);
    this.store.dispatch(new SetRadiusSize(num));
  }
}

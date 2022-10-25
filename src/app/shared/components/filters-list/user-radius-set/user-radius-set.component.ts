import { Component, OnInit } from '@angular/core';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import {
  GetFilteredWorkshops,
  SetRadiusSize
} from '../../../store/filter.actions';
import { DestroyableDirective } from '../../../directives/destroyable.directive';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-radius-set',
  templateUrl: './user-radius-set.component.html',
  styleUrls: ['./user-radius-set.component.scss']
})
export class UserRadiusSetComponent
  extends DestroyableDirective
  implements OnInit
{
  public defaultValue: number = 5;
  public options = { floor: 2, ceil: 10 };
  public currentRadius: FormControl = new FormControl({
    value: '',
    disabled: true
  });
  8;
  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.setValue(this.defaultValue);
    this.subscribeOnValueChanges();
  }

  public radiusHandler(event: ChangeContext): void {
    event.pointerType && this.setValue(event.highValue);
  }

  private setValue(number): void {
    this.currentRadius.setValue(number);
    this.store.dispatch(new SetRadiusSize(number));
  }

  private subscribeOnValueChanges() {
    this.currentRadius.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(() => {
        this.store.dispatch(new GetFilteredWorkshops(true));
      });
  }
}

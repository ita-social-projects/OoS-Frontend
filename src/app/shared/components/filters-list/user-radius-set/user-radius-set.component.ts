import { Component, OnInit } from '@angular/core';
import { ChangeContext } from '@angular-slider/ngx-slider';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SetRadiusSize } from '../../../store/filter.actions';

@Component({
  selector: 'app-user-radius-set',
  templateUrl: './user-radius-set.component.html',
  styleUrls: ['./user-radius-set.component.scss']
})
export class UserRadiusSetComponent implements OnInit {
  public defaultRadiusInKm = 5;
  public options = { floor: 2, ceil: 10 };
  public currentRadius: FormControl = new FormControl({
    value: '',
    disabled: true
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.setValue(this.defaultRadiusInKm);
  }

  public radiusHandler(event: ChangeContext): void {
    event.pointerType && this.setValue(event.highValue);
  }

  private setValue(kilometers: number): void {
    this.currentRadius.setValue(kilometers);
    this.store.dispatch(new SetRadiusSize(kilometers));
  }
}

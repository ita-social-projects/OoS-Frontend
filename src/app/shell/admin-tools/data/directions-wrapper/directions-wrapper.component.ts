import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';

@Component({
  selector: 'app-directions-wrapper',
  templateUrl: './directions-wrapper.component.html',
  styleUrls: ['./directions-wrapper.component.scss'],
})
export class DirectionsWrapperComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Directions,
        isActive: false,
        disable: true,
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
  }
}

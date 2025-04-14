import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from 'shared/store/registration.actions';

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss']
})
export class ForbiddenPageComponent {
  constructor(private store: Store) {}

  public onBack(): void {
    this.store.dispatch(new Logout());
  }
}

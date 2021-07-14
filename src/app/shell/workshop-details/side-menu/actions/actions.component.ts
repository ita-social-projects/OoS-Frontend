import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import {  Login } from 'src/app/shared/store/registration.actions';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  displayed: boolean = this.isDisplayed();
  @Input() workshop: Workshop;

  constructor(private store: Store) { }

  /**
  * This method takes user Role and return boolean type for "displayed"
  * to display button
  */

  isDisplayed(): boolean {
    const user: User = this.store.selectSnapshot<User>(RegistrationState.user);
    if (user) {
      return false
    }
    return true
  }
  login(): void {
    this.store.dispatch(new Login());
  }
  ngOnInit(): void {
    this.isDisplayed();
  }

}
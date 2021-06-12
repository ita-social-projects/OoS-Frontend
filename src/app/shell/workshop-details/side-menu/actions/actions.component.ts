import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Role } from 'src/app/shared/enum/role';

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
    if(user && user.role === Role.provider) {
      return false
    }
    return true
  }

  ngOnInit(): void {
    this.isDisplayed();
  }

}

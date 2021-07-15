import { Store } from '@ngxs/store';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit, Provider } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  isDisplayed: boolean = false;
  isRegistered: boolean = false;

  @Input() workshop: Workshop;

  constructor(private store: Store) { }

  ngOnInit(): void {
    const user = this.store.selectSnapshot<User>(RegistrationState.user);
    if (user) {
      this.isRegistered = true;
      if (user.role !== Role.provider) {
        this.isDisplayed = true;
      }
    }
    else{
      this.isDisplayed = true;
    }

  }
}

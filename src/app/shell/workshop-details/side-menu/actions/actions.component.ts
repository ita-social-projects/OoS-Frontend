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
  isDisplayed: boolean;
  @Input() workshop: Workshop;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.isDisplayed = this.store.selectSnapshot<User>(RegistrationState.user).role !== Role.provider;
  }

}

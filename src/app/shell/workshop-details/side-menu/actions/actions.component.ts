import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Role } from 'src/app/shared/enum/role';
import { Router } from '@angular/router';
import { Login } from 'src/app/shared/store/registration.actions';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  isCreateApplicationDisplayed: boolean;
  userRole: string;

  @Input() workshop: Workshop;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<User>(RegistrationState.user)?.role
    this.isCreateApplicationDisplayed = this.userRole === Role.parent || this.userRole === undefined;
  }

  onCreateApplication(): void {
    !this.userRole && this.store.dispatch(new Login());
  }

}

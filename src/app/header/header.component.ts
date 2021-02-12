import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RegistrationComponent } from '../shared/modals/registration/registration.component';
import { Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../shared/store/user-registration.state';
import { Observable } from 'rxjs';
import { CallApi, Logout, CheckAuth } from '../shared/store/user-registration.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Select(UserRegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;

  constructor(private modalDialog: MatDialog,
    public store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth())
  }
  openModal() {
    this.modalDialog.open(RegistrationComponent);
  }
  logout(): void {
    this.store.dispatch(new Logout())  
  }
  callApi(): void {
  this.store.dispatch(new CallApi())  
  }
  

}

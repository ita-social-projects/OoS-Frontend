import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RegistrationComponent } from '../shared/modals/registration/registration.component';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../shared/store/user-registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, AuthFail } from '../shared/store/user-registration.actions';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user = {
    firstName: 'Іванов В. М'
  }

  @Select(UserRegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;

  constructor(private modalDialog: MatDialog,
    public store: Store,
    private actions$: Actions,
    public snackBar: MatSnackBar) { 
      actions$.pipe(
        ofAction(AuthFail)
      ).subscribe(action => {
          this.snackBar.open('Check your connection', "Try again!", {
          duration: 5000,
          panelClass: ['red-snackbar'],
          });
      })
    }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth())
  }
  openModal() {
    this.modalDialog.open(RegistrationComponent);
  }
  logout(): void {
    this.store.dispatch(new Logout())  
  }
}

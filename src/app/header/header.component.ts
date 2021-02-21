import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../shared/store/user-registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, AuthFail, Login } from '../shared/store/user-registration.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user = {
    firstName: 'Іванов В. М'
  }
  showModalReg: boolean = false;

  @Select(UserRegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;

  constructor(private modalDialog: MatDialog,
    public store: Store,
    private actions$: Actions,
    public snackBar: MatSnackBar,
    private router: Router) { 
      actions$.pipe(
        ofAction(AuthFail)
      ).subscribe(action => {
          this.snackBar.open('Check your connection', 'Try again!', {
          duration: 5000,
          panelClass: ['red-snackbar'],
          });
      })
    }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth())
  }
  logout(): void {
    this.store.dispatch(new Logout())  
  }
  login(): void{
    this.store.dispatch(new Login())
  }

  toggleModalReg(): void {
    this.showModalReg = !this.showModalReg;
  }
  @HostListener('document:click', ['$event'])
  onClick(event) {
      if (!event.target.closest('.registration_button, .registration_window')) {
        this.showModalReg = false;
      }
  }
}

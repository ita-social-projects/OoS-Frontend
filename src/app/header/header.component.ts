import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../shared/store/user-registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, AuthFail, Login, UserName, Role} from '../shared/store/user-registration.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

enum RoleLinks{
  provider='provider',
  parent ='parent'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  role:string="";
  roles=RoleLinks;
  
  @Select(UserRegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(UserRegistrationState.userName)
  userName$: Observable<string>;
  @Select(UserRegistrationState.role)
  role$: Observable<string>;
  
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
      });
    }
  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
    this.role$.subscribe(()=>{
      this.role = this.store.selectSnapshot<string>(UserRegistrationState.role);
    })
  }
  logout(): void {
    this.store.dispatch(new Logout());
  }
  login(): void{
    this.store.dispatch(new Login());
  }
}

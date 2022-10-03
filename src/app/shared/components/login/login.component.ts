import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { Login } from '../../store/registration.actions';

@Component({
  selector: 'app-login',
  template: '',
})
export class LoginComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new Login(false));
  }
}

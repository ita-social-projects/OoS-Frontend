import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../store/user-registration.actions';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent { 
  
  constructor(public store: Store) {}

  ngOnInit(): void {  }
    login(): void {
   this.store.dispatch(new Login())  
  }
}

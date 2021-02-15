<<<<<<< Updated upstream
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../store/user-registration.actions';
=======
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Component, OnInit } from '@angular/core';
>>>>>>> Stashed changes

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
<<<<<<< Updated upstream
export class RegistrationComponent { 
  
  constructor(public store: Store) {}
=======
export class RegistrationComponent implements OnInit { 
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient) {
  }

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => console.log('is authenticated', auth));
  }
>>>>>>> Stashed changes

  ngOnInit(): void {  }
  
  login(): void {
    this.store.dispatch(new Login())  
  }
}

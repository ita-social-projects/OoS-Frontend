import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent { 
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient) {
  }

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => console.log('is authenticated', auth));
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }
}

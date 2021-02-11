import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChangeAuthorization } from '../../store/app.actions';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent { 
  

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient,
    public store: Store) {
  }

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        this.store.dispatch(new ChangeAuthorization(auth))
        console.log('is authenticated', auth)
      });
  }

  login(): void {
    this.oidcSecurityService.authorize();
    
  }
  logout(): void {
    let isAuth: boolean;
    this.oidcSecurityService.checkAuth().subscribe(value => {
      isAuth = value;
    });
    if (isAuth) {
      this.oidcSecurityService.logoff();
    }
  }
  callApi(): void {
    const token = this.oidcSecurityService.getToken();

    this.http.get('http://localhost:5000/Organization/TestOk', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: 'text'
    })
      .subscribe((data: any) => {
        console.log('api result:', data);
      });
  }
}

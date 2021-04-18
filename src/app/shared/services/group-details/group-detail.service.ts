import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GroupDetailService{
  constructor(private http: HttpClient, private token: OidcSecurityService) {

  }
  getWorkshopDetail(): Observable<object>{
    const token = this.token.getToken();
    return  this.http.get('http://api.oos.dmytrominochkin.cloud/Workshop/GetById/1', {
      headers: {Authorization: `Bearer ${token}`}
    });
    // this.http.get('http://api.oos.dmytrominochkin.cloud/Teacher/GetById/1', {
    //     headers: {Authorization: `Bearer ${token}`}
    //   }).subscribe(value1 => console.log(value1));
    // this.http.get('http://api.oos.dmytrominochkin.cloud/Address/GetAddressById/1', {
    //     headers: {Authorization: `Bearer ${token}`}
    //   }).subscribe(value2 => console.log(value2));
  }
}

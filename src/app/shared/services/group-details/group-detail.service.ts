import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Observable} from 'rxjs';

@Injectable()
export class GroupDetailService {
  id: number;

  constructor(private http: HttpClient, private token: OidcSecurityService) {

  }

  getWorkshopDetail(): Observable<object> {
    const token = this.token.getToken();
    return this.http.get(`http://api.oos.dmytrominochkin.cloud//Workshop/GetById${this.id}`, {
      headers: {Authorization: `Bearer ${token}`}
    });
  }
}

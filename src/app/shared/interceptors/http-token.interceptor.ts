import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/org-cards/auth.service';
import { Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../store/user-registration.state';

​
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
​
constructor(
  public auth: AuthService,
  public store: Store) {}

    @Select(UserRegistrationState.role)
    role$: Observable<string>;

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      ​
          let token = this.auth.getToken();
          const role = this.store.selectSnapshot<string>(UserRegistrationState.role);
      ​
          const tokenTitle = (role) ?  'token': 'Authorization';
          // 'token !== null' added to avoid pass condition when "typeof token === 'string'" and token is set to 'Bearer null'
          if (role && token !== null) {
            token = `Bearer ${token}`;
            console.log('Http token interceptor works!')
          }
      ​
          if (typeof token === 'string') {
            return next.handle(request.clone({
              setHeaders: { [tokenTitle]: token }
            })).pipe(catchError((error) => {
              return throwError(error);
            }));
          }
          return next.handle(request).pipe(catchError((error) => {
            return throwError(error);
          }));
        }
      }
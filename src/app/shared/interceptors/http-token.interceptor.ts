import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/org-cards/auth.service';
import { Observable, throwError } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../store/user-registration.state';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    public store: Store) {}

  //@Select(UserRegistrationState.role)
  //role$: Observable<string>;
    
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.auth.getToken();
    //const role = this.store.selectSnapshot<string>(UserRegistrationState.role);
    const role ='provider';
    const tokenTitle = (role) ?  'token': 'Authorization';
    alert('Http token interceptor works!')
    if (role && token !== null) {
      token = `Bearer ${token}`;
    }
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

// @Injectable()
// export class HttpTokenInterceptor implements HttpInterceptor {
//   constructor(public auth: AuthService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {

//     let token = this.auth.getToken();
//     //const role = this.store.selectSnapshot<string>(UserRegistrationState.role);
//     const role ='provider';
//     const tokenTitle = (role) ?  'token': 'Authorization';

//     const authReq = req.clone({
//       headers: req.headers.set( tokenTitle, token ),
//     })

//     return next.handle(authReq).pipe(
//       tap(
//         (event) => {
//           if (event instanceof HttpResponse)
//             console.log('Server response')
//         },
//         (err) => {
//           if (err instanceof HttpErrorResponse) {
//             if (err.status == 401)
//               console.log('Unauthorized')
//           }
//         }
//       )
//     )
//   }
// }
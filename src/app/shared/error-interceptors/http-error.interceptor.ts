import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
 
// export class HttpErrorInterceptor implements HttpInterceptor {
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
// import { Observable, throwError } from 'rxjs';
// import { retry, catchError } from 'rxjs/operators';
import { CheckAuthFail } from '../store/user-registration.actions';

@Injectable({

  providedIn: 'root'
 
 })
 
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor(public store: Store) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if(error.status===0 ){
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}; No response; User is not authorized; Check your internet connection`;
            errorMessage = 'No response; User is not authorized; Check your internet connection';
          }else{
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          } 
        }
        this.store.dispatch(new CheckAuthFail(errorMessage))
        console.log(errorMessage);
        return throwError(errorMessage);
    
    
      })
    )
  }
}
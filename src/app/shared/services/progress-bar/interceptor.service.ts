import { ProgressBarService } from './progress-bar.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(public ProgressBarService: ProgressBarService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.ProgressBarService.isLoading.next(true);
    return next.handle(req).pipe(
      finalize(
        ()=>{
          this.ProgressBarService.isLoading.next(false);
        }
      )
    );
  }
}

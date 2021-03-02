import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { HttpTokenInterceptor } from './http-token.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const InterceptorProviders = 
   [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },   
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
];
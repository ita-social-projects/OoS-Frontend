import { Observable } from 'rxjs';

export const MockOidcSecurityService = {
  authorize: (): void => {},
  logoff: (): void => {},
  getToken: (): void => {
    'some_token_eVbnasdQ324';
  },
  getAccessToken: (): Observable<any> =>
    new Observable((subscriber) => {
      subscriber.next(true);
      subscriber.complete();
    }),
  checkAuth: (): Observable<any> =>
    new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(true);
        subscriber.complete();
      }, 1);
    })
};

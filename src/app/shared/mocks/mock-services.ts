import { Observable } from 'rxjs';

export const MockCityFilterService = {
  fetchCities: () => {
    return new Observable<any>();
  },
};

export const MockStore = {
  dispatch: () => {
  },
  subscribe: () => {
  },
  select: () => {
  },
};

export const MockOidcSecurityService = {
  authorize: () => {
  },
  logoff: () => {
  },
  getToken: () => {
    'some_token_eVbnasdQ324';
  },
  checkAuth: () => {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(true);
        subscriber.complete();
      }, 1);
    });
  }
};

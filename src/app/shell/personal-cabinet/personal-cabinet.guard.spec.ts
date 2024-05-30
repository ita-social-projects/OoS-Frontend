import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { User } from 'shared/models/user.model';
import { RegistrationState } from 'shared/store/registration.state';

import { PersonalCabinetGuard } from './personal-cabinet.guard';

describe('PersonalCabinetGuard', () => {
  let guard: PersonalCabinetGuard;
  let store: Store;
  let router: Router;
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(PersonalCabinetGuard);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called if user is registered', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(true));

    const canLoad = guard.canLoad();
    canLoad.subscribe((value) => {
      expect(value).toEqual(true);
      done();
    });
  });

  it('should return UrlTree if canLoad called if user is not registered', (done) => {
    mockUser = {
      dateOfBirth: '01/01/2004',
      firstName: 'ГАв',
      id: '23',
      isBlocked: false,
      isRegistered: false,
      lastName: 'фівв',
      role: 'provider'
    };

    const mockUrlTree = new UrlTree();
    jest.spyOn(router, 'createUrlTree').mockReturnValue(mockUrlTree);
    jest.spyOn(store, 'select').mockImplementation((selector: any) => {
      if (selector === RegistrationState.isRegistered) {
        return of(false);
      } else if (selector === RegistrationState.user) {
        return of(mockUser);
      }
      return of(null); // Default return for other selectors, adjust as necessary
    });

    const canLoad = guard.canLoad();
    canLoad.subscribe((value) => {
      expect(value).toEqual(mockUrlTree);
      done();
    });
  });
});

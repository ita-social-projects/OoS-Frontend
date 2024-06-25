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
  const mockUser: User = {
    dateOfBirth: '01/01/2004',
    firstName: 'ГАв',
    id: '23',
    isBlocked: false,
    isRegistered: false,
    lastName: 'фівв',
    role: 'provider'
  };

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
    mockUser.isRegistered = true;
    jest.spyOn(store, 'select').mockReturnValue(of(mockUser));

    const canLoad = guard.canLoad();
    canLoad.subscribe((value) => {
      expect(value).toEqual(true);
      done();
    });
  });

  it('should return UrlTree if canLoad called if user is not registered', (done) => {
    mockUser.isRegistered = false;
    const mockUrlTree = new UrlTree();
    jest.spyOn(router, 'createUrlTree').mockReturnValue(mockUrlTree);
    jest.spyOn(store, 'select').mockReturnValue(of(mockUser));

    const canLoad = guard.canLoad();
    canLoad.subscribe((value) => {
      console.log('value' + value);
      expect(value).toEqual(mockUrlTree);
      done();
    });
  });
});

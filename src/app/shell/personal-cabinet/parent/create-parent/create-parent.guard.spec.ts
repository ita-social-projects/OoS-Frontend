import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { User } from 'shared/models/user.model';

import { CreateParentGuard } from './create-parent.guard';

describe('CreateParentGuard', () => {
  let guard: CreateParentGuard;
  let store: Store;
  let router: Router;
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });

    guard = TestBed.inject(CreateParentGuard);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    mockUser = {
      dateOfBirth: '01/01/2004',
      firstName: 'ГАв',
      id: '23',
      isBlocked: false,
      isRegistered: false,
      lastName: 'фівв',
      role: 'parent'
    };
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called if user is parent and not registered', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(mockUser));
    const canLoad = guard.canLoad();
    canLoad.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });
});

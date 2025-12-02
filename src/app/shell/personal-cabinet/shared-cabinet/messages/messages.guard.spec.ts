import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { MessagesGuard } from './messages.guard';

describe('MessagesGuard', () => {
  let guard: MessagesGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(MessagesGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canActivate called with parent role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.parent));

    const canActivate = guard.canActivate();

    canActivate.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return TRUE if canActivate called with provider role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.provider));

    const canActivate = guard.canActivate();

    canActivate.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canActivate called with non parent nor provider role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.ministryAdmin));

    const canActivate = guard.canActivate();

    canActivate.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});

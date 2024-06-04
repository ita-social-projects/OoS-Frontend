import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { ModeConstants } from 'shared/constants/constants';
import { PersonalCabinetGuard } from './personal-cabinet.guard';

describe('ProviderGuard', () => {
  let guard: PersonalCabinetGuard;
  let store: Store;
  let router: Router;

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
    jest.spyOn(store, 'select').mockReturnValue(of(false));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toEqual(router.createUrlTree(['/create-provider', ModeConstants.NEW]));
      done();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { PersonalCabinetGuard } from './personal-cabinet.guard';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../shared/mocks/mock-services';

describe('ProviderGuard', () => {
  let guard: PersonalCabinetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ]
    });
    guard = TestBed.inject(PersonalCabinetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

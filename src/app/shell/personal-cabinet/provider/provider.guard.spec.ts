import { TestBed } from '@angular/core/testing';
import { ProviderGuard } from './provider.guard';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../shared/mocks/mock-services';

describe('ProviderGuard', () => {
  let guard: ProviderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ]
    });
    guard = TestBed.inject(ProviderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

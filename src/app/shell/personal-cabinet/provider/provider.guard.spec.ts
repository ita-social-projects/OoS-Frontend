import { TestBed } from '@angular/core/testing';
import { ProviderGuard } from './provider.guard';
import { NgxsModule, Store } from '@ngxs/store';

describe('ProviderGuard', () => {
  let guard: ProviderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(ProviderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

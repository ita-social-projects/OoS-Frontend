import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ProviderGuard } from './provider.guard';

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

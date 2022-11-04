import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { CreateProviderGuard } from './create-provider.guard';

describe('CreateProviderGuard', () => {
  let guard: CreateProviderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(CreateProviderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

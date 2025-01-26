import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ProviderRoleGuard } from './provider-role.guard';

describe('ProviderRoleGuard', () => {
  let guard: ProviderRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(ProviderRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

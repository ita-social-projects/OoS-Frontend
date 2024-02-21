import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { PersonalCabinetGuard } from './personal-cabinet.guard';

describe('ProviderGuard', () => {
  let guard: PersonalCabinetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(PersonalCabinetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

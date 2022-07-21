import { TestBed } from '@angular/core/testing';
import { PersonalCabinetGuard } from './personal-cabinet.guard';
import { NgxsModule } from '@ngxs/store';

describe('ProviderGuard', () => {
  let guard: PersonalCabinetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
    });
    guard = TestBed.inject(PersonalCabinetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

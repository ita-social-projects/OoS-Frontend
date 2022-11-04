import { TestBed } from '@angular/core/testing';
import { ParentGuard } from './parent.guard';
import { NgxsModule } from '@ngxs/store';

describe('ParentGuard', () => {
  let guard: ParentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(ParentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

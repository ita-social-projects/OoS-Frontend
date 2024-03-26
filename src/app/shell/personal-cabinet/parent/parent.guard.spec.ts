import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { ParentGuard } from './parent.guard';

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

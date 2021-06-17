import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { CreateGuard } from './create.guard';

describe('CreateGuard', () => {
  let guard: CreateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule]
    });
    guard = TestBed.inject(CreateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

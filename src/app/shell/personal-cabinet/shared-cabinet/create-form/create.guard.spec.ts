import { TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { NgxsModule } from '@ngxs/store';

import { CreateGuard } from './create.guard';

describe('CreateGuard', () => {
  let guard: CreateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatDialogModule]
    });
    guard = TestBed.inject(CreateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

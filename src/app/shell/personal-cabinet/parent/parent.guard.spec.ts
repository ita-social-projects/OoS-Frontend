import { TestBed } from '@angular/core/testing';

import { ParentGuard } from './parent.guard';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../shared/mocks/mock-services';

describe('ParentGuard', () => {
  let guard: ParentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ]
    });
    guard = TestBed.inject(ParentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

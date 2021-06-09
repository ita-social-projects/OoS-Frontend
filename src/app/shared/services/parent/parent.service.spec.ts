import { TestBed } from '@angular/core/testing';

import { ParentService } from './parent.service';

describe('ParentService', () => {
  let service: ParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChildrenService } from './children.service';

describe('CildrenService', () => {
  let service: ChildrenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildrenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TagService } from './tag-workshop.service';

describe('DirectionService', () => {
  let service: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

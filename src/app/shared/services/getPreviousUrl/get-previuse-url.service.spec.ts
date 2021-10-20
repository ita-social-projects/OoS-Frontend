import { TestBed } from '@angular/core/testing';

import { GetPreviuseUrlService } from './get-previuse-url.service';

describe('GetPreviuseUrlService', () => {
  let service: GetPreviuseUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPreviuseUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

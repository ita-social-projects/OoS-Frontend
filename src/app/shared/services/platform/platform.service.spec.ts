import { TestBed } from '@angular/core/testing';

import { PlatformService } from './platform.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

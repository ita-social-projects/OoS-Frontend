import { TestBed } from '@angular/core/testing';

import { PortalService } from './portal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PortalService', () => {
  let service: PortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

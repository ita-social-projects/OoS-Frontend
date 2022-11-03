import { TestBed } from '@angular/core/testing';

import { FeatureManagementService } from './feature-management.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeatureManagementService', () => {
  let service: FeatureManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FeatureManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

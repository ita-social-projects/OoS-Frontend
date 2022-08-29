import { TestBed } from '@angular/core/testing';

import { DetectedDeviceService } from './detected-device.service';

describe('DetectedDeviceService', () => {
  let service: DetectedDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectedDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

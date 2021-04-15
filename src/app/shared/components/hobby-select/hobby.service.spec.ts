import { TestBed } from '@angular/core/testing';

import { HobbyService } from './hobby.service';

describe('HobbyService', () => {
  let service: HobbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HobbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

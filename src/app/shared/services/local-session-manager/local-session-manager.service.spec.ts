import { TestBed } from '@angular/core/testing';

import { LocalSessionManagerService } from './local-session-manager.service';

describe('LocalSessionManagerService', () => {
  let service: LocalSessionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSessionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

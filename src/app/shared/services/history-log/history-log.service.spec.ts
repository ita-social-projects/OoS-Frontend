import { TestBed } from '@angular/core/testing';

import { HistoryLogService } from './history-log.service';

describe('HistoryLogService', () => {
  let service: HistoryLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

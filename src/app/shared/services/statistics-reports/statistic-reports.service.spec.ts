import { TestBed } from '@angular/core/testing';

import { StatisticReportsService } from './statistic-reports.service';

describe('StatisticsReportsService', () => {
  let service: StatisticReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

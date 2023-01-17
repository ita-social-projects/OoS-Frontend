import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { StatisticReportsService } from './statistic-reports.service';

describe('StatisticsReportsService', () => {
  let service: StatisticReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(StatisticReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

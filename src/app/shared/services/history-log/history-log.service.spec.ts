import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { HistoryLogService } from './history-log.service';

describe('HistoryLogService', () => {
  let service: HistoryLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(HistoryLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

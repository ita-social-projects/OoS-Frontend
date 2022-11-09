import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CodeficatorService } from './codeficator.service';

describe('CodeficatorService', () => {
  let service: CodeficatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CodeficatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

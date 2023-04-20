import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { DirectionsService } from './directions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DirectionsService', () => {
  let service: DirectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(DirectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

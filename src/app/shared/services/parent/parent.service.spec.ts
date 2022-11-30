import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ParentService } from './parent.service';

describe('ParentService', () => {
  let service: ParentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ParentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

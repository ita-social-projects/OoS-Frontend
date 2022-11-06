import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { PreviousUrlService } from './previous-url.service';

describe('PreviousUrlService', () => {
  let service: PreviousUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(PreviousUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

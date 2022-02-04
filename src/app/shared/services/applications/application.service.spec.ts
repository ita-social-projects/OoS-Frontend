import { TestBed } from '@angular/core/testing';

import { ApplicationService } from './application.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Applications', () => {
  let service: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(ApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

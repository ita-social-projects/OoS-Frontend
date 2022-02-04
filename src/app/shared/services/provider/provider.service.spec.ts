import { TestBed } from '@angular/core/testing';
import { ProviderService } from './provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

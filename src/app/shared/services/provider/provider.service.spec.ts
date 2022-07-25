import { TestBed } from '@angular/core/testing';
import { ProviderService } from './provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([])],
    });
    service = TestBed.inject(ProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

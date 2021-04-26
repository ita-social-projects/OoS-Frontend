import { TestBed } from '@angular/core/testing';

import { ProviderWorkshopsService } from './provider-workshops';

describe('ProviderWorkshopsService', () => {
  let service: ProviderWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

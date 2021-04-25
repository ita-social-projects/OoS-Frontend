import { TestBed } from '@angular/core/testing';

import { ParentWorkshopsService } from './parent-workshops';

describe('ProviderWorkshopsService', () => {
  let service: ParentWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

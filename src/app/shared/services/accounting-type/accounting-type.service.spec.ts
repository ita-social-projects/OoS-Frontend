import { TestBed } from '@angular/core/testing';

import { AccountingTypeService } from './accounting-type.service';

describe('AccountingTypeService', () => {
  let service: AccountingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

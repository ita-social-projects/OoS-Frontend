import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountingTypeService } from './accounting-type.service';

describe('AccountingTypeService', () => {
  let service: AccountingTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AccountingTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

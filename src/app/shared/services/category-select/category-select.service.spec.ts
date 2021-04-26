import { TestBed } from '@angular/core/testing';

import { CategorySelectService } from './category-select.service';

describe('CategorySelectService', () => {
  let service: CategorySelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorySelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

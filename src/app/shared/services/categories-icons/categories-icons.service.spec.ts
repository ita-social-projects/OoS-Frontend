import { TestBed } from '@angular/core/testing';

import { CategoriesIconsService } from './categories-icons.service';

describe('CategoriesIconsService', () => {
  let service: CategoriesIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

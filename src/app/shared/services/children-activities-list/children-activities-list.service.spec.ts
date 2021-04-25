import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ChildrenActivitiesListService } from './children-activities-list.service';

describe('ChildrenListService', () => {
  let service: ChildrenActivitiesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(ChildrenActivitiesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

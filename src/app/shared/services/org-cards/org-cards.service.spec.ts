import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { OrgCardsService } from './org-cards.service';

describe('OrgCardsService', () => {
  let service: OrgCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(OrgCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

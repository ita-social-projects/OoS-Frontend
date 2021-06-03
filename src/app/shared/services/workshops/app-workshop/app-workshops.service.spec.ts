import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AppWorkshopsService } from './app-workshops.service';

describe('OrgCardsService', () => {
  let service: AppWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(AppWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

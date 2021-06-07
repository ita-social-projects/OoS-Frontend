import { TestBed } from '@angular/core/testing';
import { AppWorkshopsService } from './app-workshops.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrgCardsService', () => {
  let service: AppWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(AppWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

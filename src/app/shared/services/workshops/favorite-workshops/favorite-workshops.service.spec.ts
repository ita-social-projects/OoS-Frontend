import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FavoriteWorkshopsService } from './favorite-workshops.service';

describe('FavoriteWorkshopsService', () => {
  let service: FavoriteWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FavoriteWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

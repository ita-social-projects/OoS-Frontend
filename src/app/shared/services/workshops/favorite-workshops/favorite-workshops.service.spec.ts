import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { FavoriteWorkshopsService } from './favorite-workshops.service';

describe('FavoriteWorkshopsService', () => {
  let service: FavoriteWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(FavoriteWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { AppWorkshopsService } from './app-workshops.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';

describe('OrgCardsService', () => {
  let service: AppWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
        NgxsModule.forRoot([]), ],
    });
    service = TestBed.inject(AppWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

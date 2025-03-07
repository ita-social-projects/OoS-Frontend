import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { LanguageListItem } from 'shared/models/language-list.model';
import { LanguageListService } from './language-list.service';

describe('LanguageListService', () => {
  let service: LanguageListService;
  let httpTestingController: HttpTestingController;

  const mockApiUrl = '/api/v1/Language/Get';
  const mockLanguageList: LanguageListItem[] = [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'uk', name: 'Ukrainian' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [LanguageListService]
    });

    service = TestBed.inject(LanguageListService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request and return a list of languages', () => {
    service.getLanguageList().subscribe((response) => {
      expect(response).toEqual(mockLanguageList);
    });

    const req = httpTestingController.expectOne(mockApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLanguageList);
  });
});

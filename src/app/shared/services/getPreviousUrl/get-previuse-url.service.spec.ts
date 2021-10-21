import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GetPreviuseUrlService } from './get-previuse-url.service';

describe('GetPreviuseUrlService', () => {

  let service: GetPreviuseUrlService;
  let routerMock: RouterTestingModule

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [ GetPreviuseUrlService ]
  });
    service = TestBed.inject(GetPreviuseUrlService)
    routerMock = TestBed.inject(RouterTestingModule);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});

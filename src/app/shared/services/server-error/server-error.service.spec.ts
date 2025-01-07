import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs';
import { NgxsModule } from '@ngxs/store';
import { ServerErrorService } from './server-error.service';

describe('ServerErrorService', () => {
  let service: ServerErrorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [ServerErrorService]
    });

    service = TestBed.inject(ServerErrorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should make request to check server', () => {
    const mockResponse = { status: 'Healthy' };

    service.checkHealth().subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });

    httpMock.match('/healthz/active');
  });
});

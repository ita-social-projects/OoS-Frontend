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
    localStorage.removeItem('try-again-timer');
  });

  it('should initialize with default storageData if localStorage is empty', () => {
    expect(service.storageData).toEqual({ timerValue: 1000, time: 0 });
  });

  it('should update timerValue and save to localStorage', () => {
    service.serverIsAvailable();

    const savedData = JSON.parse(localStorage.getItem('try-again-timer') || '{}');
    expect(savedData.timerValue).toBe(2000);
  });

  it('should return correct status and timerValue from serverIsAvailable', async () => {
    const mockResponse = { status: 'Healthy' };

    const result = await service.serverIsAvailable();

    const req = httpMock.expectOne('/healthz/active');
    req.flush(mockResponse);
    expect(await result.status).toEqual(mockResponse);
    expect(await result.timerValue).toBe(2000);
  });

  it('should set isButtonDisabled to true when serverIsAvailable is called', (done) => {
    service.serverIsAvailable();
    service.isButtonDisabled$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should set isButtonDisabled to false after the timer', fakeAsync((done) => {
    service.serverIsAvailable();
    const { timerValue } = JSON.parse(localStorage.getItem('try-again-timer'));
    tick(timerValue);
    service.isButtonDisabled$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(false);
    });
  }));
});

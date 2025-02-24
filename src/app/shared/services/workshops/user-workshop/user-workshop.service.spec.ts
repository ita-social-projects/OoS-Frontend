import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { WorkshopMainRequiredProperties, WorkshopType } from 'shared/models/draftWorkshop.model';
import { FormOfLearning, PayRateType } from 'shared/enum/workshop';
import { UserWorkshopService } from './user-workshop.service';

describe('UserWorkshopService', () => {
  let service: UserWorkshopService;
  let http: HttpTestingController;

  const mockWorkshop: WorkshopMainRequiredProperties = {
    $type: WorkshopType.WithMainProperties,
    availableSeats: 4294967295,
    competitiveSelection: false,
    competitiveSelectionDescription: null,
    dateTimeRanges: [{ workdays: ['friday'], startTime: '12:22', endTime: '13:33' }],
    email: 'sleep@gmail.com',
    facebook: null,
    formOfLearning: FormOfLearning.Offline,
    instagram: null,
    maxAge: 5,
    minAge: 2,
    payRate: PayRateType.Classes,
    isPaid: true,
    phone: '+380686042323',
    price: 20,
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    shortTitle: 'fghjhgf',
    title: 'fkfkkff',
    website: 'https://stackoverflow.com/questions/47933634/angular-2-material-select-open-with-button'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [UserWorkshopService]
    });

    service = TestBed.inject(UserWorkshopService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save workshop step', (done) => {
    const mockResponse = 'MainRequiredPropertiesDto is stored';

    service.saveWorkshopStep(mockWorkshop).subscribe({
      next: (response) => {
        expect(response).toBe(mockResponse);
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Store');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockWorkshop);
    req.flush(mockResponse);
  });

  it('should delete draft workshop', (done) => {
    service.deleteUnfinishedWorkshop().subscribe({
      next: () => {
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Remove');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get draft workshop', (done) => {
    service.getUnfinishedWorkshop().subscribe({
      next: (workshop) => {
        expect(workshop).toEqual(mockWorkshop);
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Restore');
    expect(req.request.method).toBe('GET');
    req.flush(mockWorkshop);
  });

  it('should get time to live of draft', (done) => {
    service.getTimeToLiveOfUnfinishedWorkshop().subscribe({
      next: (timeToLive) => {
        expect(timeToLive).toBeTruthy();
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/GetTimeToLive');
    expect(req.request.method).toBe('GET');
    req.flush('6.04:46:52.0000000');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminImportExportService } from './admin-import-export.service';

describe('AdminImportExportService', () => {
  let service: AdminImportExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminImportExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send data to server', () => {
    const providersData = {
      edrpous: {
        1: 12345678,
        2: 12345678
      },
      emails: {
        1: 'sleep@gmail.com',
        2: 'some@gmail.com'
      }
    };
    expect(service.sendEmailsEDRPOUsForVerification(providersData)).toBeTruthy();
  });

  it('should get all providers from server', () => {
    expect(service.getAllProviders()).toBeTruthy();
  });
});

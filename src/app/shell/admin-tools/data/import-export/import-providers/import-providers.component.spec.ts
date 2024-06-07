import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { of } from 'rxjs';
import { IEmailsEdrpousResponse, IProvidersID } from 'shared/models/admin-import-export.model';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { ImportProvidersComponent } from './import-providers.component';

describe('ImportProvidersComponent', () => {
  window.alert = jest.fn();
  const currentHeaders = [
    'Назва закладу',
    'Форма власності',
    'ЄДРПОУ',
    'Ліцензія №',
    'Населений пункт',
    'Адреса',
    'Електронна пошта',
    'Телефон'
  ];
  const currentHeadersError = [
    'Наз закладу',
    'Форма власності',
    'ЄДРПОУ',
    'Ліцензія №',
    'Населений пункт',
    'Адреса',
    'Електронна пошта',
    'Телефон'
  ];
  const providersID = [
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      errors: {},
      id: 0
    }
  ];
  const providers = [
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      errors: {}
    }
  ];
  const providersErrors = [
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      id: 1,
      errors: { emailFormat: true }
    },
    {
      providerName: 'Клуб спортивного бального танцю',
      ownership: 'Державна',
      identifier: 12345678,
      licenseNumber: 123445,
      settlement: 'Луцьк',
      address: 'Шевченка 2',
      email: 'some@gmail.com',
      phoneNumber: 660666066,
      id: 1,
      errors: {}
    }
  ];
  let component: ImportProvidersComponent;
  let fixture: ComponentFixture<ImportProvidersComponent>;
  let importServiceMock: jest.Mocked<AdminImportExportService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportProvidersComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(ImportProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    importServiceMock = {
      sendEmailsEDRPOUsForVerification: jest.fn()
    } as unknown as jest.Mocked<AdminImportExportService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show Go Top button when scrolled past threshold', () => {
    const scrollPosition = component.topPosToStartShowing + 1;
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollPosition, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(component.isGoTopBtnVisible).toBe(true);
  });

  it('should hide Go Top button when scrolled above threshold', () => {
    const scrollPosition = component.topPosToStartShowing - 1;
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollPosition, writable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(component.isGoTopBtnVisible).toBe(false);
  });
  it('should call window.scroll with correct parameters when gotoTop is called', () => {
    const scrollSpy = jest.spyOn(window, 'scroll').mockImplementation(() => {});
    component.gotoTop();
    expect(scrollSpy).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    scrollSpy.mockRestore();
  });
  it('should reset values when resetValues is called', () => {
    component.dataSource = providersID;
    component.dataSourceInvalid = providersID;
    component.isToggle = true;
    component.isWarningVisible = true;
    component.resetValues();
    expect(component.dataSource).toBeNull();
    expect(component.dataSourceInvalid).toBeNull();
    expect(component.isToggle).toBe(false);
    expect(component.isWarningVisible).toBe(false);
  });
  it('should return true and cut the array when more than 100 providers', () => {
    const providersData = Array.from({ length: 150 }, (_, i) => providersID[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(true);
    expect(providersData.length).toBe(100);
  });

  it('should return false and not cut the array when less than or equal to 100 providers', () => {
    const providersData = Array.from({ length: 100 }, (_, i) => providersID[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(false);
    expect(providersData.length).toBe(100);
  });
  it('should return false and not cut the array when less than 100 providers', () => {
    const providersData = Array.from({ length: 50 }, (_, i) => providersID[0]);
    const result = component.cutArrayToHundred(providersData);
    expect(result).toBe(false);
    expect(providersData.length).toBe(50);
  });
  it('should return providers with at least one error', () => {
    const result = component.filterInvalidProviders(providersErrors);
    expect(result).toEqual([
      {
        providerName: 'Клуб спортивного бального танцю',
        ownership: 'Державна',
        identifier: 12345678,
        licenseNumber: 123445,
        settlement: 'Луцьк',
        address: 'Шевченка 2',
        email: 'some@gmail.com',
        phoneNumber: 660666066,
        id: 1,
        errors: { emailFormat: true }
      }
    ]);
  });
  it('should return true for valid headers', () => {
    const result = component.checkHeadersIsValid(currentHeaders);
    expect(result).toBe(true);
    expect(component.isWaiting).toBeFalsy();
    expect(window.alert).not.toHaveBeenCalled();
  });
  it('should return false and show alert for invalid headers', () => {
    const result = component.checkHeadersIsValid(currentHeadersError);

    // Assert
    expect(result).toBe(false);
    expect(component.isWaiting).toBe(false);
  });
  // --------------------------------------
  it('should process providers data and handle emails EDRPOUs', (done) => {
    const inputProviders = providers;
    const expectedProviders = providersID;
    const mockEmailsEdrpousResponse = { emails: [], edrpous: [] };

    jest.spyOn(component, 'cutArrayToHundred').mockReturnValue(true);
    jest.spyOn(component, 'verifyEmailsEdrpous').mockReturnValue(of(mockEmailsEdrpousResponse));
    jest.spyOn(component, 'handleData').mockImplementation(() => {});

    component.processProvidersData(inputProviders);

    expect(component.cutArrayToHundred).toHaveBeenCalledWith(inputProviders);
    expect(component.verifyEmailsEdrpous).toHaveBeenCalledWith(expectedProviders);
    component.verifyEmailsEdrpous(expectedProviders).subscribe(() => {
      expect(component.handleData).toHaveBeenCalledWith(mockEmailsEdrpousResponse, expectedProviders, true);
      done();
    });
  });
  it('should handle emails EDRPOUs and update dataSource properties', () => {
    const mockResponse: IEmailsEdrpousResponse = { emails: [], edrpous: [] };
    component.verifyEmailsEdrpous(providersID).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  });
  it('should handle data', () => {
    const isCorrectLength = true;
    const mockResponse: IEmailsEdrpousResponse = { emails: [], edrpous: [] };
    component.handleData(mockResponse, providersErrors, isCorrectLength);
    expect(component.dataSource).toBe(providersErrors);
    expect(component.isWaiting).toBe(false);
    expect(component.isWarningVisible).toBe(isCorrectLength);
  });
  it('should set selectedFile, set isWaiting to true, reset values, and convert Excel to JSON', () => {
    const mockFile = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockEvent = {
      target: {
        files: [mockFile],
        value: 'testValue'
      }
    };
    const resetValuesSpy = jest.spyOn(component, 'resetValues').mockImplementation(() => {});
    const convertExcelToJSONSpy = jest.spyOn(component, 'convertExcelToJSON').mockImplementation(() => {});
    component.onFileSelected(mockEvent);
    expect(component.selectedFile).toBe(mockFile);
    expect(component.isWaiting).toBe(true);
    expect(resetValuesSpy).toHaveBeenCalled();
    expect(convertExcelToJSONSpy).toHaveBeenCalledWith(mockEvent);
    expect(mockEvent.target.value).toBe('');
    resetValuesSpy.mockRestore();
    convertExcelToJSONSpy.mockRestore();
  });
});

import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { ExcelUploadProcessorService } from './excel-upload-processor.service';

describe('ExcelUploadProcessorService', () => {
  let service: ExcelUploadProcessorService;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    translateService = {
      instant: jest.fn((key: string) => key)
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      providers: [ExcelUploadProcessorService, { provide: TranslateService, useValue: translateService }]
    });

    service = TestBed.inject(ExcelUploadProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call alert with the correct message', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const testMessage = 'Test Alert';

    service.showAlert(testMessage);

    expect(alertSpy).toHaveBeenCalledWith(testMessage);
  });

  it('should handle invalid headers correctly', () => {
    const headers = ['Header1', 'InvalidHeader'];
    const validHeaders = ['Header1', 'Header2'];
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const result = service.checkHeadersIsValid(headers, validHeaders);

    expect(result).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('IMPORT/EXPORT.FILE_HEADERS_WARNING'));
  });

  it('should validate headers correctly', () => {
    const headers = ['Header1', 'Header2'];
    const validHeaders = ['Header1', 'Header2'];

    const result = service.checkHeadersIsValid(headers, validHeaders);

    expect(result).toBe(true);
  });

  it('should handle valid Excel file and return parsed data', (done) => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockHeaders = ['Header1', 'Header2'];
    const mockData = [{ Header1: 'Value1', Header2: 'Value2' }];
    const mockWorkBook = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} }
    } as XLSX.WorkBook;
    const standartHeadersBase = ['Header1', 'Header2'];
    const columnNamesBase = ['Header1', 'Header2'];
    const fileReaderMock = {
      readAsArrayBuffer: jest.fn(),
      onload: null as any,
      onerror: null as any
    };

    jest.spyOn(service, 'getCurrentHeaders').mockReturnValue(mockHeaders);
    jest.spyOn(service, 'getItemsData').mockReturnValue(mockData);
    jest.spyOn(service, 'checkHeadersIsValid').mockReturnValue(true);
    jest.spyOn(service as any, 'showAlert').mockImplementation(() => {});
    jest.spyOn(globalThis, 'FileReader').mockImplementation(() => fileReaderMock as unknown as FileReader);
    jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkBook);

    service.convertExcelToJSON(mockFile, standartHeadersBase, columnNamesBase).subscribe({
      next: (result) => {
        expect(result).toEqual(mockData);
        done();
      },
      error: () => {
        fail('Should not throw error for valid data');
      }
    });
    fileReaderMock.onload?.({ target: { result: new ArrayBuffer(8) } } as any);
  });

  it('should handle invalid headers and show an alert', (done) => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockHeaders = ['InvalidHeader1', 'InvalidHeader2'];
    const mockWorkBook = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} }
    } as XLSX.WorkBook;
    const fileReaderMock = {
      readAsArrayBuffer: jest.fn(),
      onload: null as any,
      onerror: null as any
    };
    const standartHeadersBase = ['Header1', 'Header2'];
    const columnNamesBase = ['Header1', 'Header2'];

    jest.spyOn(service, 'getCurrentHeaders').mockReturnValue(mockHeaders);
    jest.spyOn(service, 'checkHeadersIsValid').mockReturnValue(false);
    jest.spyOn(service as any, 'showAlert').mockImplementation(() => {});
    jest.spyOn(globalThis, 'FileReader').mockImplementation(() => fileReaderMock as unknown as FileReader);
    jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkBook);

    service.convertExcelToJSON(mockFile, standartHeadersBase, columnNamesBase).subscribe({
      next: () => {
        fail('Should not emit next for invalid headers');
      },
      error: (error) => {
        expect(error).toEqual('IMPORT/EXPORT.FILE_HEADERS_ERROR');
        done();
      }
    });
    fileReaderMock.onload?.({ target: { result: new ArrayBuffer(8) } } as any);
  });

  it('should handle FileReader error and show an alert', (done) => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileReaderMock = {
      readAsArrayBuffer: jest.fn(),
      onload: null as any,
      onerror: null as any
    };
    const standartHeadersBase = ['Header1', 'Header2'];
    const columnNamesBase = ['Header1', 'Header2'];

    jest.spyOn(globalThis, 'FileReader').mockImplementation(() => fileReaderMock as unknown as FileReader);
    jest.spyOn(service as any, 'showAlert').mockImplementation(() => {});

    service.convertExcelToJSON(mockFile, standartHeadersBase, columnNamesBase).subscribe({
      next: () => {
        fail('Should not emit next for FileReader error');
      },
      error: (error) => {
        expect(error).toEqual('IMPORT/EXPORT.FILE_READER_ERROR');
        done();
      }
    });
    fileReaderMock.onerror?.(new ProgressEvent('error', { bubbles: true }));
  });
});

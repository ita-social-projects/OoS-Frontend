import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngxs/store';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';
import { UploadExcelComponent } from './upload-excel.component';

describe('UploadExcelComponent', () => {
  window.alert = jest.fn();
  let component: UploadExcelComponent<any>;
  let mockImportValidationService: jest.Mocked<ImportValidationService<any>>;
  let excelService: ExcelUploadProcessorService;
  let mockExcelService: Partial<ExcelUploadProcessorService>;
  let mockEmployeeUploadProcessor: EmployeeUploadProcessorService<any>;
  let mockStore: jest.Mocked<Store>;
  let fixture: ComponentFixture<UploadExcelComponent<any>>;
  let mockSubscription: { unsubscribe: jest.Mock };
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    mockExcelService = {
      convertExcelToJSON: jest.fn()
    };
    mockSubscription = { unsubscribe: jest.fn() };
    mockImportValidationService = { checkForInvalidData: jest.fn() } as any;
    mockStore = {
      select: jest.fn()
    } as unknown as jest.Mocked<Store>;
    await TestBed.configureTestingModule({
      declarations: [UploadExcelComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        EmployeeUploadProcessorService,
        { provide: ExcelUploadProcessorService, useValue: mockExcelService },
        { provide: ImportValidationService, useValue: mockImportValidationService },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();
    component = new UploadExcelComponent(mockImportValidationService, excelService, mockEmployeeUploadProcessor, mockStore);
    fixture = TestBed.createComponent(UploadExcelComponent);
    component = fixture.componentInstance;
    component.isLoading = true;
    component.subscription = mockSubscription as any;
    mockEmployeeUploadProcessor = TestBed.inject(EmployeeUploadProcessorService);
    httpMock = TestBed.inject(HttpTestingController);
    excelService = TestBed.inject(ExcelUploadProcessorService);
    fixture.detectChanges();
  });

  describe('should create', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('sendValidItems method', () => {
    let storeMock: any;
    const mockCurrentId = '123';

    beforeEach(() => {
      storeMock = { selectSnapshot: jest.fn().mockReturnValue(mockCurrentId) };
      // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
      component['store'] = storeMock as any;
      component.dataSource = [
        { sequenceNumber: 1, errors: {} },
        { sequenceNumber: 2, errors: {} }
      ];
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should handle a successful response', () => {
      const HttpStatusCode = { Ok: 200 };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.sendValidItems();

      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${mockCurrentId}/employees/upload`);
      expect(req.request.method).toBe('PUT');
      req.flush({ status: HttpStatusCode.Ok, body: 'Success' });
      expect(component.isLoading).toBe(false);
      expect(component.loadSuccess).not.toBe(true);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    it('should handle an error response', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      component.sendValidItems();

      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${mockCurrentId}/employees/upload`);
      expect(req.request.method).toBe('PUT');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
      expect(component.isLoading).toBe(false);
      expect(component.loadFailure).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    it('should handle an unknown error response', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      component.sendValidItems();

      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${mockCurrentId}/employees/upload`);
      expect(req.request.method).toBe('PUT');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
      expect(component.isLoading).toBe(false);
      expect(component.loadFailure).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error Message:',
        'Http failure response for /api/v1/Provider/Upload/123/employees/upload: 500 Server Error'
      );
    });
  });
  describe('onFileSelected method', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should handle file selection and process successfully', () => {
      const mockFile = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const event = { target: { files: [mockFile] } } as unknown as Event;
      const mockItems = [{ sequenceNumber: 1, errors: {} }];
      jest.spyOn(mockExcelService, 'convertExcelToJSON').mockReturnValue(of(mockItems));
      jest.spyOn(component, 'resetValues').mockImplementation();
      jest.spyOn(component, 'processUploadData').mockImplementation();

      component.onFileSelected(event);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.isLoading).toBe(false);
      expect(component.resetValues).toHaveBeenCalled();
      expect(mockExcelService.convertExcelToJSON).toHaveBeenCalledWith(mockFile, component.standardHeaders, component.columnNames);
      expect(component.processUploadData).toHaveBeenCalledWith(mockItems);
      expect((event.target as HTMLInputElement).value).toBe('');
    });

    it('should handle file selection and log an error when conversion fails', () => {
      const mockFile = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const event = { target: { files: [mockFile] } } as unknown as Event;
      const mockError = new Error('Excel conversion failed');
      jest.spyOn(mockExcelService, 'convertExcelToJSON').mockReturnValue(throwError(() => mockError));
      jest.spyOn(component, 'resetValues').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      component.onFileSelected(event);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.isLoading).toBe(false);
      expect(component.resetValues).toHaveBeenCalled();
      expect(mockExcelService.convertExcelToJSON).toHaveBeenCalledWith(mockFile, component.standardHeaders, component.columnNames);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Excel conversion error:', mockError);
      expect((event.target as HTMLInputElement).value).toBe('');
    });
  });

  describe('renamingKeys method', () => {
    it('should return the same array when renamingKeys is called', () => {
      const mockItems = [
        { key1: 'value1', key2: 'value2' },
        { key1: 'value3', key2: 'value4' }
      ];

      const result = component.renamingKeys(mockItems);

      expect(result).toEqual(mockItems);
    });
    it('should call resetValues and unsubscribe when cleanup is called', () => {
      component.subscription = mockSubscription as any;
      const resetValuesSpy = jest.spyOn(component, 'resetValues');

      component.cleanup();

      expect(resetValuesSpy).toHaveBeenCalled();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('resetValues method test', () => {
    it('should reset values when resetValues is called', () => {
      component.dataSource = ['example'];
      component.dataSourceInvalid = ['invalid example'];
      component.isToggle = true;
      component.isWarningVisible = true;
      component.isLoading = true;
      component.loadFailure = true;
      component.loadSuccess = true;

      component.resetValues();

      expect(component.dataSource).toBeNull();
      expect(component.dataSourceInvalid).toBeNull();
      expect(component.isToggle).toBe(false);
      expect(component.isWarningVisible).toBe(false);
      expect(component.isLoading).toBe(false);
      expect(component.loadFailure).toBe(false);
      expect(component.loadSuccess).toBe(false);
    });
  });

  describe('showsIsTruncated method tests', () => {
    const example = [{ text: 'example' }];
    it('should return true and cut the array when more than 100 providers', () => {
      const itemData = Array.from({ length: 150 }, (_, i) => example[0]);

      const result = component.showsIsTruncated(itemData);

      expect(result).toBe(true);
      expect(itemData.length).toBe(100);
    });

    it('should return false and not cut the array when less than or equal to 100 providers', () => {
      const itemData = Array.from({ length: 100 }, (_, i) => example[0]);

      const result = component.showsIsTruncated(itemData);

      expect(result).toBe(false);
      expect(itemData.length).toBe(100);
    });

    it('should return false and not cut the array when less than 100 providers', () => {
      const itemData = Array.from({ length: 50 }, (_, i) => example[0]);

      const result = component.showsIsTruncated(itemData);

      expect(result).toBe(false);
      expect(itemData.length).toBe(50);
    });
  });

  describe('filterInvalidItems method tests', () => {
    it('should return items with at least one error', () => {
      const items = [
        { id: 1, errors: { nameError: null, ageError: null } },
        { id: 2, errors: { nameError: 'Invalid name', ageError: null } },
        { id: 3, errors: { nameError: null, ageError: 'Invalid age' } }
      ];

      const result = component.filterInvalidItems(items);

      expect(result.length).toBe(2);
      expect(result).toEqual([
        { id: 2, errors: { nameError: 'Invalid name', ageError: null } },
        { id: 3, errors: { nameError: null, ageError: 'Invalid age' } }
      ]);
    });
  });

  describe('processUploadData method test', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should process items data correctly', () => {
      const inputItems = [{ name: 'Item1' }, { name: 'Item2' }];
      const showsIsTruncatedSpy = jest.spyOn(component, 'showsIsTruncated').mockReturnValue(true);
      const handleDataSpy = jest.spyOn(component, 'handleData').mockImplementation(() => {});

      component.processUploadData(inputItems);

      expect(showsIsTruncatedSpy).toHaveBeenCalledWith(inputItems);
      showsIsTruncatedSpy.mockRestore();
      handleDataSpy.mockRestore();
    });
  });

  describe('handleData method test', () => {
    it('should handle data correctly, call checkForInvalidData, and set component properties', () => {
      const isCorrectLength = true;
      const items = [
        { id: 1, errors: {} },
        { id: 2, errors: {} }
      ];

      component.handleData(items, isCorrectLength);

      expect(mockImportValidationService.checkForInvalidData).toHaveBeenCalledWith(items, component.extendsComponentConfig);
      expect(component.dataSource).toBe(items);
      expect(component.dataSourceInvalid).toEqual(component.filterInvalidItems(items));
      expect(component.isLoading).toBe(false);
      expect(component.isWarningVisible).toBe(isCorrectLength);
    });
  });
});

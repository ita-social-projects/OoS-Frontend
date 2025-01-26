/* eslint-disable dot-notation */
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
  let mockImportValidationService: jest.Mocked<ImportValidationService>;
  let excelService: ExcelUploadProcessorService;
  let mockExcelService: Partial<ExcelUploadProcessorService>;
  let mockEmployeeUploadProcessor: EmployeeUploadProcessorService;
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
    component = new UploadExcelComponent(mockImportValidationService, excelService, mockEmployeeUploadProcessor, mockStore);
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
    fixture = TestBed.createComponent(UploadExcelComponent);
    component = fixture.componentInstance;
    component.isLoading = true;
    component.subscription = mockSubscription as any;
    mockEmployeeUploadProcessor = TestBed.inject(EmployeeUploadProcessorService);
    httpMock = TestBed.inject(HttpTestingController);
    excelService = TestBed.inject(ExcelUploadProcessorService);
    fixture.detectChanges();
  });

  describe('sendValidItems method', () => {
    it('should handle a successful response', () => {
      // Arrange
      component.currentUserId = '123';
      component.dataSource = [
        { sequenceNumber: 1, errors: {} },
        { sequenceNumber: 2, errors: {} }
      ];

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      component.sendValidItems();

      // Assert
      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${component.currentUserId}/employees/upload`);
      expect(req.request.method).toBe('PUT');
      req.flush({ status: 200, body: 'Success' });

      expect(component.isLoading).toBe(false);
      expect(component.loadSuccess).toBe(true);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    it('should handle an error response', () => {
      // Arrange
      component.currentUserId = '123';
      component.dataSource = [
        { sequenceNumber: 1, errors: {} },
        { sequenceNumber: 2, errors: {} }
      ];

      // Spy on console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      component.sendValidItems();

      // Assert
      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${component.currentUserId}/employees/upload`); // Тестуємо правильний URL
      expect(req.request.method).toBe('PUT');
      req.flush('Error', { status: 500, statusText: 'Server Error' }); // Відправка фіктивної помилки

      // Перевіряємо, що відповідні зміни відбулись
      expect(component.isLoading).toBe(false);
      expect(component.loadFailure).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalled(); // Перевірка, що помилка була зафіксована
    });
    it('should handle an unknown error response', () => {
      // Arrange
      component.currentUserId = '123';
      component.dataSource = [
        { sequenceNumber: 1, errors: {} },
        { sequenceNumber: 2, errors: {} }
      ];

      // Spy on console.error to verify that the error is logged
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      component.sendValidItems();

      // Simulate an HTTP error response with a 500 status (Unknown error)
      const req = httpMock.expectOne(`/api/v1/Provider/Upload/${component.currentUserId}/employees/upload`);
      expect(req.request.method).toBe('PUT');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      // Assert
      expect(component.isLoading).toBe(false); // Ensure isLoading is set to false
      expect(component.loadFailure).toBe(true); // Ensure loadFailure is set to true

      // Check that the correct error message was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error Response:',
        expect.objectContaining({
          message: 'Http failure response for /api/v1/Provider/Upload/123/employees/upload: 500 Server Error'
        })
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error Message:',
        'Http failure response for /api/v1/Provider/Upload/123/employees/upload: 500 Server Error'
      );
    });
  });
  describe('onFileSelected method', () => {
    it('should handle file selection and process successfully', () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const event = { target: { files: [mockFile] } } as unknown as Event;

      const mockItems = [{ sequenceNumber: 1, errors: {} }];
      jest.spyOn(mockExcelService, 'convertExcelToJSON').mockReturnValue(of(mockItems));
      jest.spyOn(component, 'resetValues').mockImplementation();
      jest.spyOn(component, 'processUploadData').mockImplementation();

      // Act
      component.onFileSelected(event);

      // Assert
      expect(component.selectedFile).toBe(mockFile); // Ensure the file is assigned
      expect(component.isLoading).toBe(true); // Ensure loading starts
      expect(component.resetValues).toHaveBeenCalled(); // Reset values
      expect(mockExcelService.convertExcelToJSON).toHaveBeenCalledWith(mockFile, component.standardHeadersBase, component.columnNamesBase); // Call service
      expect(component.processUploadData).toHaveBeenCalledWith(mockItems); // Verify items processed
      expect((event.target as HTMLInputElement).value).toBe(''); // Input reset
    });

    it('should handle file selection and log an error when conversion fails', () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const event = { target: { files: [mockFile] } } as unknown as Event;

      const mockError = new Error('Excel conversion failed');
      jest.spyOn(mockExcelService, 'convertExcelToJSON').mockReturnValue(throwError(() => mockError));
      jest.spyOn(component, 'resetValues').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Act
      component.onFileSelected(event);

      // Assert
      expect(component.selectedFile).toBe(mockFile); // Ensure the file is assigned
      expect(component.isLoading).toBe(true); // Ensure loading starts
      expect(component.resetValues).toHaveBeenCalled(); // Reset values
      expect(mockExcelService.convertExcelToJSON).toHaveBeenCalledWith(mockFile, component.standardHeadersBase, component.columnNamesBase); // Call service
      expect(consoleErrorSpy).toHaveBeenCalledWith('Excel conversion error:', mockError); // Verify error logging
      expect((event.target as HTMLInputElement).value).toBe(''); // Input reset
    });
  });
  describe('initializeLoadingIndicatorObserver method', () => {});

  describe('getCurrentUserId method', () => {
    it('should update currentUserId with the value from the store', (done) => {
      const mockUserId = '1234';
      mockStore.select.mockReturnValue(of(mockUserId));
      component.getCurrentUserId();
      setTimeout(() => {
        expect(component.currentUserId).toBe(mockUserId);
        done();
      }, 0);
    });

    it('should not update currentUserId if store emits no value', (done) => {
      mockStore.select.mockReturnValue(of(undefined));
      component.getCurrentUserId();
      setTimeout(() => {
        expect(component.currentUserId).toBeUndefined();
        done();
      }, 0);
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

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('setStandardHeaders method test', () => {
    it('should set standard headers correctly', () => {
      const headers = ['Header1', 'Header2', 'Header3'];
      component.setStandardHeaders(headers);
      expect(component.standardHeadersBase).toEqual(headers);
    });
  });

  describe('setColumnNames method test', () => {
    it('should set column names correctly', () => {
      const columnNames = ['Column1', 'Column2', 'Column3'];
      component.setColumnNames(columnNames);
      expect(component.columnNamesBase).toEqual(columnNames);
    });
  });

  describe('handleData method test', () => {
    let checkForInvalidDataSpy: jest.SpyInstance;
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      checkForInvalidDataSpy = jest.spyOn(component['importValidationService'], 'checkForInvalidData').mockImplementation(() => {});
    });
    afterEach(() => {
      if (checkForInvalidDataSpy) {
        checkForInvalidDataSpy.mockRestore();
      }
    });
    it('should handle data correctly, call checkForInvalidData, and set component properties', () => {
      const isCorrectLength = true;
      const items = [
        { id: 1, errors: {} },
        { id: 2, errors: {} }
      ];
      component.handleData(items, isCorrectLength);
      expect(checkForInvalidDataSpy).toHaveBeenCalledWith(items, component.extendsComponentConfig);
      expect(component.dataSource).toBe(items);
      expect(component.dataSourceInvalid).toEqual(component.filterInvalidItems(items));
      expect(component.isLoading).toBe(false);
      expect(component.isWarningVisible).toBe(isCorrectLength);
    });
  });
});

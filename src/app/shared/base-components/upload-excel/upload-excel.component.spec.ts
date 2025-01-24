import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngxs/store';
import { UploadExcelComponent } from './upload-excel.component';

describe('UploadExcelComponent', () => {
  window.alert = jest.fn();
  const example = [{ text: 'example' }];

  let component: UploadExcelComponent<any>;
  let fixture: ComponentFixture<UploadExcelComponent<any>>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadExcelComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            select: jest.fn().mockReturnValue(of())
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(UploadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.standardHeadersBase = ['Header1', 'Header2', 'Header3']; // Initialize standardHeadersBase
    component.isLoading = true;
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

  // describe('checkHeadersIsValid method tests', () => {
  //   afterEach(() => {
  //     jest.restoreAllMocks();
  //   });

  //   it('should return true for valid headers', () => {
  //     const currentHeaders = ['Header1', 'Header2', 'Header3'];

  //     const result = component.checkHeadersIsValid(currentHeaders);

  //     expect(result).toBe(true);
  //     expect(component.isLoading).toBe(true);
  //     expect(window.alert).not.toHaveBeenCalled();
  //   });

  //   it('should return false and show alert for invalid headers', () => {
  //     const currentHeadersError = ['Header1', 'WrongHeader', 'Header3'];

  //     const result = component.checkHeadersIsValid(currentHeadersError);

  //     expect(result).toBe(false);
  //     expect(component.isLoading).toBe(false);
  //     expect(window.alert).toHaveBeenCalled();
  //   });

  //   it('should return false if headers are partially correct but in the wrong order', () => {
  //     const currentHeadersWrongOrder = ['Header3', 'Header1', 'Header2'];

  //     const result = component.checkHeadersIsValid(currentHeadersWrongOrder);

  //     expect(result).toBe(false);
  //     expect(component.isLoading).toBe(false); // isLoading should be set to false
  //     expect(window.alert).toHaveBeenCalled();
  //   });
  // });

  // describe('processProvidersData method test', () => {
  //   it('should process items data correctly', () => {
  //     const inputItems = [{ name: 'Item1' }, { name: 'Item2' }];

  //     const showsIsTruncatedSpy = jest.spyOn(component, 'showsIsTruncated').mockReturnValue(true);
  //     const handleDataSpy = jest.spyOn(component, 'handleData').mockImplementation(() => {});

  //     component.processUploadData(inputItems);

  //     expect(showsIsTruncatedSpy).toHaveBeenCalledWith(inputItems);

  //     const expectedItemsWithIds = inputItems.map((elem, index) => ({ ...elem, id: index }));
  //     expect(handleDataSpy).toHaveBeenCalledWith(expectedItemsWithIds, true);

  //     showsIsTruncatedSpy.mockRestore();
  //     handleDataSpy.mockRestore();
  //   });
  // });

  describe('handleData method test', () => {
    let checkForInvalidDataSpy: jest.SpyInstance;
    beforeEach(() => {
      checkForInvalidDataSpy = jest.spyOn((component as any).importValidationService, 'checkForInvalidData').mockImplementation(() => {});
    });
    afterEach(() => {
      checkForInvalidDataSpy.mockRestore(); // Restore the mock after each test
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

  // describe('onFileSelected method test', () => {
  //   let excelServiceMock: any;
  //   beforeEach(() => {
  //     excelServiceMock = {
  //       convertExcelToJSON: jest.fn()
  //     };

  //     // component = new UploadExcelComponent(excelServiceMock);
  //     component.resetValues = jest.fn(); // Spy on resetValues
  //     component.processUploadData = jest.fn(); // Spy on processUploadData
  //   });

  //   it('should handle errors during Excel conversion', () => {
  //     const mockFile = new File(['mock content'], 'test.xlsx', {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //     });
  //     const mockEvent = {
  //       target: {
  //         files: [mockFile],
  //         value: 'mockValue'
  //       }
  //     } as unknown as Event;

  //     const mockError = new Error('Conversion failed');
  //     excelServiceMock.convertExcelToJSON.mockReturnValue(throwError(() => mockError)); // Mock the observable to throw an error

  //     console.error = jest.fn(); // Spy on console.error

  //     // Ensure these properties are initialized
  //     component.standardHeadersBase = ['Header1', 'Header2', 'Header3'];
  //     component.columnNamesBase = undefined;

  //     // Call the method
  //     component.onFileSelected(mockEvent);

  //     // Check if the mock was called with the correct arguments
  //     expect(excelServiceMock.convertExcelToJSON).toHaveBeenCalledWith(mockFile, component.standardHeadersBase, component.columnNamesBase);
  //     expect(component.isLoading).toBe(true);
  //     expect(component.resetValues).toHaveBeenCalled();
  //     expect(component.processUploadData).not.toHaveBeenCalled();
  //     expect(console.error).toHaveBeenCalledWith('Excel conversion error:', mockError);
  //     expect((mockEvent.target as HTMLInputElement).value).toBe('');
  //   });
  // });
});

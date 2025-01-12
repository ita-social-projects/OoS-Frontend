import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UploadExcelComponent } from './upload-excel.component';

describe('UploadExcelComponent', () => {
  window.alert = jest.fn();
  const example = [{ text: 'example' }];

  let component: UploadExcelComponent<any, any>;
  let fixture: ComponentFixture<UploadExcelComponent<any, any>>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadExcelComponent],
      imports: [TranslateModule.forRoot()]
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

  describe('checkScroll method tests', () => {
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
  });

  describe('gotoTop method test', () => {
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
  });

  describe('resetValues method test', () => {
    it('should reset values when resetValues is called', () => {
      component.dataSource = ['example'];
      component.dataSourceInvalid = ['invalid example'];
      component.isToggle = true;
      component.isWarningVisible = true;
      component.resetValues();
      expect(component.dataSource).toBeNull();
      expect(component.dataSourceInvalid).toBeNull();
      expect(component.isToggle).toBe(false);
      expect(component.isWarningVisible).toBe(false);
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

  describe('checkHeadersIsValid method tests', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true for valid headers', () => {
      const currentHeaders = ['Header1', 'Header2', 'Header3'];

      const result = component.checkHeadersIsValid(currentHeaders);

      expect(result).toBe(true);
      expect(component.isLoading).toBe(true);
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should return false and show alert for invalid headers', () => {
      const currentHeadersError = ['Header1', 'WrongHeader', 'Header3'];

      const result = component.checkHeadersIsValid(currentHeadersError);

      expect(result).toBe(false);
      expect(component.isLoading).toBe(false);
      expect(window.alert).toHaveBeenCalled();
    });

    it('should return false if headers are partially correct but in the wrong order', () => {
      const currentHeadersWrongOrder = ['Header3', 'Header1', 'Header2'];

      const result = component.checkHeadersIsValid(currentHeadersWrongOrder);

      expect(result).toBe(false);
      expect(component.isLoading).toBe(false); // isLoading should be set to false
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe('processProvidersData method test', () => {
    it('should process items data correctly', () => {
      const inputItems = [{ name: 'Item1' }, { name: 'Item2' }];

      const showsIsTruncatedSpy = jest.spyOn(component, 'showsIsTruncated').mockReturnValue(true);
      const handleDataSpy = jest.spyOn(component, 'handleData').mockImplementation(() => {});

      component.processProvidersData(inputItems);

      expect(showsIsTruncatedSpy).toHaveBeenCalledWith(inputItems);

      const expectedItemsWithIds = inputItems.map((elem, index) => ({ ...elem, id: index }));
      expect(handleDataSpy).toHaveBeenCalledWith(expectedItemsWithIds, true);

      showsIsTruncatedSpy.mockRestore();
      handleDataSpy.mockRestore();
    });
  });

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

  describe('onFileSelected method test', () => {
    it('should set selectedFile, set isWaiting to true, reset values, and convert Excel to JSON', () => {
      const mockFile = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockEvent = {
        target: {
          files: [mockFile],
          value: 'testValue'
        }
      } as unknown as Event;
      const resetValuesSpy = jest.spyOn(component, 'resetValues').mockImplementation(() => {});
      const convertExcelToJSONSpy = jest.spyOn(component, 'convertExcelToJSON').mockImplementation(() => {});
      component.onFileSelected(mockEvent);
      expect(component.selectedFile).toBe(mockFile);
      expect(component.isLoading).toBe(true);
      expect(resetValuesSpy).toHaveBeenCalled();
      expect(convertExcelToJSONSpy).toHaveBeenCalledWith(mockFile);
      expect((mockEvent.target as HTMLInputElement).value).toBe('');
      resetValuesSpy.mockRestore();
      convertExcelToJSONSpy.mockRestore();
    });
  });
});

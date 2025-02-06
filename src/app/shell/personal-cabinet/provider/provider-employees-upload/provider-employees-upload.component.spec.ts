import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';

import { ProviderEmployeesUploadComponent } from './provider-employees-upload.component';

describe('ProviderEmployeesUploadComponent', () => {
  let component: ProviderEmployeesUploadComponent;
  let fixture: ComponentFixture<ProviderEmployeesUploadComponent>;
  let importValidationService: jest.Mocked<ImportValidationService<any>>;
  let excelService: jest.Mocked<ExcelUploadProcessorService>;
  let employeeUploadProcessor: jest.Mocked<EmployeeUploadProcessorService<any>>;
  let store: jest.Mocked<Store>;

  beforeEach(async () => {
    importValidationService = {
      checkForInvalidData: jest.fn()
    } as unknown as jest.Mocked<ImportValidationService<any>>;
    excelService = {
      convertExcelToJSON: jest.fn()
    } as unknown as jest.Mocked<ExcelUploadProcessorService>;
    employeeUploadProcessor = {} as unknown as jest.Mocked<EmployeeUploadProcessorService<any>>;
    store = { dispatch: jest.fn() } as unknown as jest.Mocked<Store>;

    await TestBed.configureTestingModule({
      declarations: [ProviderEmployeesUploadComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ImportValidationService, useValue: importValidationService },
        { provide: ExcelUploadProcessorService, useValue: excelService },
        { provide: EmployeeUploadProcessorService, useValue: employeeUploadProcessor },
        { provide: Store, useValue: store }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderEmployeesUploadComponent);
    component = fixture.componentInstance;
  });

  it('should initialize columnNames and standardHeaders on ngOnInit', () => {
    const importEmployeesColumnsNames = {
      sequenceNumber: 'sequenceNumber',
      employeeSurname: 'employeeSurname',
      employeeName: 'employeeName',
      employeeFatherName: 'employeeFatherName',
      employeeRNOKPP: 'employeeRNOKPP',
      employeeAssignedRole: 'employeeAssignedRole'
    };
    const importEmployeesStandardHeaders = {
      sequenceNumber: '№',
      employeeSurname: 'Прізвище',
      employeeName: 'Імя',
      employeeFatherName: 'По батькові',
      employeeRNOKPP: 'РНОКПП',
      employeeAssignedRole: 'Призначені ролі'
    };

    // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
    component['ImportEmployeesColumnsNames'] = importEmployeesColumnsNames;
    // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
    component['ImportEmployeesStandardHeaders'] = importEmployeesStandardHeaders;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.columnNames).toEqual(Object.keys(importEmployeesColumnsNames)); // Compare with field names (keys)
    expect(component.standardHeaders).toEqual(Object.values(importEmployeesStandardHeaders)); // Assuming this matches your test expectations
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set componentFieldsConfig during initialization', () => {
    expect(component.extendsComponentConfig).toEqual(component.componentFieldsConfig);
  });

  it('should call cleanup on ngOnDestroy', () => {
    const cleanupSpy = jest.spyOn(component, 'cleanup');

    component.ngOnDestroy();

    expect(cleanupSpy).toHaveBeenCalled();
  });

  it('should rename keys correctly in renamingKeys', () => {
    const inputItems = [
      {
        employeeAssignedRole: 'Employee',
        employeeFatherName: 'MiddleName',
        employeeName: 'FirstName',
        employeeRNOKPP: 1234567890,
        employeeSurname: 'LastName',
        errors: {},
        sequenceNumber: 1
      }
    ];

    const expectedOutput = [
      {
        assignedRole: 'Employee',
        middleName: 'MiddleName',
        firstName: 'FirstName',
        rnokpp: '1234567890',
        lastName: 'LastName'
      }
    ];

    const result = component.renamingKeys(inputItems);

    expect(result).toEqual(expectedOutput);
  });
});

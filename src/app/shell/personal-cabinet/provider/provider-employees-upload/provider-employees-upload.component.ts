import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';

import { UploadExcelComponent } from 'shared/base-components/upload-excel/upload-excel.component';
import { ImportEmployeesColumnsNames, ImportEmployeesStandardHeaders } from 'shared/enum/enumUA/import-export';
import { Employee, FieldsConfig, RenamedEmployee } from 'shared/models/admin-import-export.model';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';

@Component({
  selector: 'app-provider-employees-upload',
  templateUrl: './provider-employees-upload.component.html',
  styleUrls: ['./provider-employees-upload.component.scss']
})
export class ProviderEmployeesUploadComponent extends UploadExcelComponent<Employee> implements OnInit, OnDestroy {
  public componentFieldsConfig: FieldsConfig[] = [
    {
      fieldName: 'employeeName',
      validationParam: { checkEmpty: true, checkLength: true, checkLanguage: true }
    },
    {
      fieldName: 'employeeSurname',
      validationParam: { checkEmpty: true, checkLength: true, checkLanguage: true }
    },
    {
      fieldName: 'employeeFatherName',
      validationParam: { checkEmpty: true, checkLength: true, checkLanguage: true }
    },
    {
      fieldName: 'employeeRNOKPP',
      validationParam: { checkEmpty: true, checkDuplicate: true }
    },
    {
      fieldName: 'employeeAssignedRole',
      validationParam: { checkEmpty: true, checkAssignedRole: true }
    }
  ];

  constructor(
    importValidationService: ImportValidationService<Employee>,
    excelUploadProcessor: ExcelUploadProcessorService,
    employeeUploadProcessor: EmployeeUploadProcessorService<Employee>,
    store: Store
  ) {
    super(importValidationService, excelUploadProcessor, employeeUploadProcessor, store);
    this.extendsComponentConfig = this.componentFieldsConfig;
  }

  public ngOnInit(): void {
    this.columnNames = Object.values(ImportEmployeesColumnsNames);
    this.standardHeaders = Object.values(ImportEmployeesStandardHeaders);
  }

  /**
   * This method rename existing keys names in accordance with the backend requirements
   * This method rewrite in derived component with an evaluation of the key names appropriate for this component
   * @param items - array of uploaded items that pass all checks
   * @return new array with renamed keys
   */
  public renamingKeys(items: Employee[]): RenamedEmployee[] {
    return items.map((item) => ({
      assignedRole: item?.employeeAssignedRole,
      middleName: item?.employeeFatherName,
      firstName: item?.employeeName,
      rnokpp: item?.employeeRNOKPP.toString() ?? '',
      lastName: item?.employeeSurname
    }));
  }
}

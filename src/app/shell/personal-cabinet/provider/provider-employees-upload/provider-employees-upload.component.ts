import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';

import { UploadExcelComponent } from 'shared/base-components/upload-excel/upload-excel.component';
import { ImportEmployeesColumnsNames, ImportEmployeesStandardHeaders } from 'shared/enum/enumUA/import-export';
import { Employee, FieldsConfig } from 'shared/models/admin-import-export.model';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';

@Component({
  selector: 'app-provider-employees-upload',
  templateUrl: './provider-employees-upload.component.html',
  styleUrls: ['./provider-employees-upload.component.scss']
})
export class ProviderEmployeesUploadComponent extends UploadExcelComponent<Employee> implements OnInit, OnDestroy {
  public readonly displayedColumns: string[] = Object.values(ImportEmployeesColumnsNames);
  public readonly standardHeaders: string[] = Object.values(ImportEmployeesStandardHeaders);
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
    importValidationService: ImportValidationService,
    excelService: ExcelUploadProcessorService,
    employeeUploadProcessor: EmployeeUploadProcessorService,
    store: Store
  ) {
    super(importValidationService, excelService, employeeUploadProcessor, store);
    this.extendsComponentConfig = this.componentFieldsConfig;
  }

  public ngOnInit(): void {
    this.setColumnNames(this.displayedColumns);
    this.setStandardHeaders(this.standardHeaders);
    this.initializeLoadingIndicatorObserver();
    this.getCurrentUserId();
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * This method rename existing keys names in accordance with the backend requirements
   * This method rewrite in derived component with an evaluation of the key names appropriate for this component
   * @param items - array of uploaded items that pass all checks
   * @return new array with renamed keys
   */
  public renamingKeys(items: any[]): any[] {
    return items.map((item) => ({
      assignedRole: (item as any).employeeAssignedRole,
      middleName: (item as any).employeeFatherName,
      firstName: (item as any).employeeName,
      rnokpp: (item as any).employeeRNOKPP.toString(),
      lastName: (item as any).employeeSurname
    }));
  }
}

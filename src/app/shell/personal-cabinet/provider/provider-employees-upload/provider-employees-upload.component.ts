import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'ngx-window-token';
import { UploadExcelComponent } from 'shared/base-components/upload-excel/upload-excel.component';
import { ImportEmployeesColumnsNames, ImportEmployeesStandardHeaders } from 'shared/enum/enumUA/import-export';
import { Employee, EmployeeId, FieldsConfig } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';

@Component({
  selector: 'app-provider-employees-upload',
  templateUrl: './provider-employees-upload.component.html',
  styleUrls: ['./provider-employees-upload.component.scss']
})
export class ProviderEmployeesUploadComponent extends UploadExcelComponent<Employee, EmployeeId> implements OnInit {
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
      validationParam: { checkEmpty: true, checkRNOKPP: true }
    },
    {
      fieldName: 'employeeAssignedRole',
      validationParam: { checkEmpty: true, checkAssignedRole: true }
    }
  ];
  constructor(
    importValidationService: ImportValidationService,
    translate: TranslateService,
    @Inject(DOCUMENT) document: Document,
    @Inject(WINDOW) window: Window
  ) {
    super(importValidationService, translate, document, window);
    this.extendsComponentConfig = this.componentFieldsConfig;
  }
  public ngOnInit(): void {
    this.setColumnNames(this.displayedColumns);
    this.setStandardHeaders(this.standardHeaders);
  }
}

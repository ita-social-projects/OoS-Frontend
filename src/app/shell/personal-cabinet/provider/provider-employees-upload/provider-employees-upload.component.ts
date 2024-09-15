import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'ngx-window-token';
import { UploadExcelComponent } from 'shared/base-components/upload-excel/upload-excel.component';
import { ImportEmployeesColumnsNames, ImportEmployeesStandardHeaders } from 'shared/enum/enumUA/import-export';
import { ImportValidationService } from 'shared/services/admin-import-export/import-validation/import-validation.service';

@Component({
  selector: 'app-provider-employees-upload',
  templateUrl: './provider-employees-upload.component.html',
  styleUrls: ['./provider-employees-upload.component.scss']
})
export class ProviderEmployeesUploadComponent extends UploadExcelComponent implements OnInit {
  public readonly displayedColumns: string[] = Object.values(ImportEmployeesColumnsNames);
  public readonly standardHeaders: string[] = Object.values(ImportEmployeesStandardHeaders);
  constructor(
    importValidationService: ImportValidationService,
    translate: TranslateService,
    @Inject(DOCUMENT) document: Document,
    @Inject(WINDOW) window: Window
  ) {
    super(importValidationService, translate, document, window);
  }
  public ngOnInit(): void {
    this.setColumnNames(this.displayedColumns);
    this.setStandardHeaders(this.standardHeaders);
  }
}

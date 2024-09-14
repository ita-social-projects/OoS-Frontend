import { Component } from '@angular/core';
import { UploadExcelComponent } from 'shared/base-components/upload-excel/upload-excel.component';
import { ImportEmployeesColumnsNames } from 'shared/enum/enumUA/tech-admin/import-export';

@Component({
  selector: 'app-provider-employees-upload',
  templateUrl: './provider-employees-upload.component.html',
  styleUrls: ['./provider-employees-upload.component.scss']
})
export class ProviderEmployeesUploadComponent extends UploadExcelComponent {
  public readonly displayedColumns: string[] = Object.values(ImportEmployeesColumnsNames);
}

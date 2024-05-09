import { Component } from '@angular/core';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';

@Component({
  selector: 'app-export-providers',
  templateUrl: './export-providers.component.html',
  styleUrls: ['./export-providers.component.scss']
})
export class ExportProvidersComponent {
  constructor(private importExportService: AdminImportExportService) {}

  public getAllProviders(): any {
    return this.importExportService.getAllProviders().subscribe((response) => {
      const newBlob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), response], { type: 'text/csv' });
      const res = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = res;
      link.download = 'Список надавачів.csv';
      link.click();
    });
  }
}

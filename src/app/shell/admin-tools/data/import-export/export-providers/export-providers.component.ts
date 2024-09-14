import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'ngx-window-token';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';

@Component({
  selector: 'app-export-providers',
  templateUrl: './export-providers.component.html',
  styleUrls: ['./export-providers.component.scss']
})
export class ExportProvidersComponent {
  constructor(
    private importExportService: AdminImportExportService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  public getAllProviders(): any {
    return this.importExportService.getAllProviders().subscribe((response) => {
      const newBlob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), response], { type: 'text/csv' });
      const url = (this.window as any).URL.createObjectURL(newBlob);
      const link = this.document.createElement('a');
      link.href = url;
      link.download = 'Список надавачів.csv';
      this.document.body.appendChild(link);
      link.click();
      this.document.body.removeChild(link);
      (this.window as any).URL.revokeObjectURL(url);
    });
  }
}

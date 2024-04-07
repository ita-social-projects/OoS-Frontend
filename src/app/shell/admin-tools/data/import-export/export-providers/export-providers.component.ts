import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, filter, takeUntil, tap } from 'rxjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';

@Component({
  selector: 'app-export-providers',
  templateUrl: './export-providers.component.html',
  styleUrls: ['./export-providers.component.scss']
})
export class ExportProvidersComponent implements OnInit, OnDestroy {
  constructor(private importExportService: AdminImportExportService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  // public getAllProviders(): any {
  //   console.log('work');
  //   return this.importExportService.getAllProviders().subscribe((data: HttpResponse<Blob>) => data);
  // }

  public getAllProviders(): any {
    return this.importExportService.getAllProviders().subscribe((data) => console.log(data));
  }
}

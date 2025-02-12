import { Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { Store } from '@ngxs/store';

import { FieldsConfig, ValidationError } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';

@Component({
  selector: 'app-import-providers',
  template: '<div></div>',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent<DataSource extends { errors: ValidationError; sequenceNumber: number }> implements OnDestroy {
  public extendsComponentConfig: FieldsConfig[];
  public isToggle: boolean;
  public isLoading: boolean = false;
  public loadSuccess: boolean = false;
  public loadFailure: boolean = false;
  public isWarningVisible: boolean = false;
  public selectedFile: File = null;
  public columnNames: string[];
  public standardHeaders: string[];
  public dataSource: DataSource[];
  public dataSourceInvalid: DataSource[];
  public subscription: Subscription;
  constructor(
    protected readonly importValidationService: ImportValidationService<DataSource>,
    private readonly excelUploadProcessor: ExcelUploadProcessorService,
    private readonly employeeUploadProcessor: EmployeeUploadProcessorService<DataSource>,
    private store: Store
  ) {}

  /**
   * This method process array of items
   * 1. check array length ,proper length 100
   * @param items
   */
  public processUploadData(items: DataSource[]): void {
    const isArrayTruncated = this.showsIsTruncated(items);
    this.handleData(items, isArrayTruncated);
  }

  /**
   * This method process array of items
   * @param items - array of uploaded items
   * @param isArrayTruncated - boolean;indicates whether the array was truncated
   */
  public handleData(items: DataSource[], isArrayTruncated: boolean): void {
    this.importValidationService.checkForInvalidData(items, this.extendsComponentConfig);
    this.dataSource = items;
    this.dataSourceInvalid = this.filterInvalidItems(items);
    this.isLoading = false;
    this.isWarningVisible = isArrayTruncated;
  }

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files[0];
    this.isLoading = true;
    this.resetValues();
    this.excelUploadProcessor.convertExcelToJSON(this.selectedFile, this.standardHeaders, this.columnNames).subscribe({
      next: (items) => {
        this.isLoading = false;
        this.processUploadData(items);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Excel conversion error:', err);
      }
    });
    target.value = '';
  }

  /**
   * This method filter invalid items from original array and collect them in new array
   * @param items - array of uploaded items
   * @return array with all invalid items
   */
  public filterInvalidItems(items: DataSource[]): DataSource[] {
    return items.filter((elem) => Object.values(elem.errors).find(Boolean));
  }

  public showsIsTruncated(items: DataSource[]): boolean {
    const cutItems = items.splice(100, items.length);
    return Boolean(cutItems.length);
  }

  public sendValidItems(): void {
    this.isLoading = true;
    const currentId = this.store.selectSnapshot((store) => store.registration?.provider?.id);
    if (!currentId) {
      console.error('User ID is not available');
      return;
    }
    const deletedTemporaryKeys = this.dataSource.map(({ errors, sequenceNumber, ...rest }) => rest);
    const changedItems = this.renamingKeys(deletedTemporaryKeys);
    this.employeeUploadProcessor
      .uploadEmployeesList(changedItems, currentId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: HttpResponse<string>) => {
          if (response.status === HttpStatusCode.Ok) {
            this.loadSuccess = true;
          } else {
            this.loadFailure = true;
            console.error('Unexpected Response Status:', response.status);
          }
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            console.error('Error Message:', err.message);
          }
          this.loadFailure = true;
        }
      });
  }

  /**
   * This method rename existing keys names in accordance with the backend requirements
   * This method rewrite in derived component with an evaluation of the key names appropriate for derived component
   * @param items - array of uploaded items that pass all checks
   * @return new array with renamed keys
   */
  public renamingKeys(items: Omit<DataSource, 'errors' | 'sequenceNumber'>[]): any[] {
    return items;
  }

  public resetValues(): void {
    this.dataSource = null;
    this.dataSourceInvalid = null;
    this.isToggle = false;
    this.isWarningVisible = false;
    this.isLoading = false;
    this.loadFailure = false;
    this.loadSuccess = false;
  }

  public cleanup(): void {
    this.resetValues();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }
}

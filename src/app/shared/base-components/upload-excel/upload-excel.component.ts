import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';
import { Store } from '@ngxs/store';

import { FieldsConfig } from 'shared/models/admin-import-export.model';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';

@Component({
  selector: 'app-import-providers',
  template: '<div></div>',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent<ImitatorInterface extends { errors: unknown; sequenceNumber: unknown }> implements OnDestroy, OnInit {
  public extendsComponentConfig: FieldsConfig[];
  public isToggle: boolean;
  public isLoading = false;
  public loadSuccess = false;
  public loadFailure = false;
  public isWarningVisible: boolean = false;
  public selectedFile: File = null;
  public columnNamesBase: string[];
  public standardHeadersBase: string[];
  public dataSource: ImitatorInterface[];
  public dataSourceInvalid: ImitatorInterface[];
  public subscription: Subscription;
  constructor(
    protected readonly importValidationService: ImportValidationService,
    private readonly excelService: ExcelUploadProcessorService,
    private readonly employeeUploadProcessor: EmployeeUploadProcessorService,
    private store: Store
  ) {}

  ngOnInit(): void {}

  public initializeLoadingIndicatorObserver(): void {
    this.subscription = this.excelService.isLoading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  public setColumnNames(columnNames: string[]): void {
    this.columnNamesBase = columnNames;
  }

  public setStandardHeaders(headers: string[]): void {
    this.standardHeadersBase = headers;
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

  /**
   * This method process array of items
   * 1. check array length ,proper length 100
   * @param items
   */
  public processUploadData(items: ImitatorInterface[]): void {
    const isArrayTruncated = this.showsIsTruncated(items);
    this.handleData(items, isArrayTruncated);
  }

  /**
   * This method process array of items
   * @param items - array of uploaded items
   * @param isArrayTruncated - boolean;indicates whether the array was truncated
   */
  public handleData(items: ImitatorInterface[], isArrayTruncated: boolean): void {
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
    this.excelService.convertExcelToJSON(this.selectedFile, this.standardHeadersBase, this.columnNamesBase).subscribe({
      next: (items) => {
        this.processUploadData(items);
      },
      error: (err) => {
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
  public filterInvalidItems(items: ImitatorInterface[]): ImitatorInterface[] {
    return items.filter((elem) => Object.values(elem.errors).find(Boolean));
  }

  public showsIsTruncated(items: ImitatorInterface[]): boolean {
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
          if (response.status === 200) {
            this.loadSuccess = true;
          } else {
            this.loadFailure = true;
            console.error('Unexpected Response Status:', response.status);
          }
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            console.error('Error Message:', err.message);
            this.loadFailure = true;
          } else {
            console.error('Unknown Error:', err);
            this.loadFailure = true;
          }
        }
      });
  }

  public cleanup(): void {
    this.resetValues();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * This method rename existing keys names in accordance with the backend requirements
   * This method rewrite in derived component with an evaluation of the key names appropriate for derived component
   * @param items - array of uploaded items that pass all checks
   * @return new array with renamed keys
   */
  public renamingKeys(items: Omit<ImitatorInterface, 'errors' | 'sequenceNumber'>[]): any[] {
    return items;
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }
}

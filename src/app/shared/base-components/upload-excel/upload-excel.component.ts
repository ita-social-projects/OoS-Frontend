import { Component } from '@angular/core';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { FieldsConfig } from 'shared/models/admin-import-export.model';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { Observable, Subscription, map } from 'rxjs';
import { EmployeeUploadProcessorService } from 'shared/services/employee-upload-processor/employee-upload-processor.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ProviderService } from 'shared/services/provider/provider.service';

@Component({
  selector: 'app-import-providers',
  template: '<div></div>',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent<ImitatorInterface extends { errors: unknown; sequenceNumber: unknown }> {
  public extendsComponentConfig: FieldsConfig[];
  public currentUserId: string;

  public isToggle: boolean;
  public isLoading = false;
  public loadSuccess = false;
  public loadFailure = false;
  public isWarningVisible: boolean = false;

  public selectedFile: any = null;
  public columnNamesBase: string[];
  public standardHeadersBase: string[];

  public dataSource: ImitatorInterface[];
  public dataSourceInvalid: ImitatorInterface[];
  private subscription: Subscription;
  constructor(
    private readonly importValidationService: ImportValidationService,
    private readonly excelService: ExcelUploadProcessorService,
    private readonly employeeUploadProcessor: EmployeeUploadProcessorService,
    private readonly providerService: ProviderService
  ) {}

  public initializeLoadingObserver(): void {
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
   * This method process array of providers
   * 1. check array length ,proper length 100
   * 2. define ID key to each provider
   * @param items
   */
  public processProvidersData(items: ImitatorInterface[]): void {
    const isArrayTruncated = this.showsIsTruncated(items);
    this.handleData(items, isArrayTruncated);
  }

  /**
   * This method process array of items
   * @param items - items with ID
   * @param isArrayTruncated - indicates whether the array was truncated
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
        this.processProvidersData(items);
      },
      error: (err) => {
        console.error('Помилка при конвертації Excel:', err);
      }
    });
    target.value = '';
  }

  public filterInvalidItems(items: ImitatorInterface[]): ImitatorInterface[] {
    return items.filter((elem) => Object.values(elem.errors).find((error) => error !== null));
  }

  public showsIsTruncated(item: any[]): boolean {
    const cutItems = item.splice(100, item.length);
    return Boolean(cutItems.length);
  }

  public changeKeysName(items: any[]): any[] {
    return items.map((item) => ({
      assignedRole: (item as any).employeeAssignedRole,
      middleName: (item as any).employeeFatherName,
      firstName: (item as any).employeeName,
      rnokpp: (item as any).employeeRNOKPP.toString(),
      lastName: (item as any).employeeSurname
    }));
  }

  public sendValidItems(): void {
    this.isLoading = true;
    if (!this.currentUserId) {
      console.error('User ID is not available');
      return;
    }
    const removeItemsErrors = this.dataSource.map(({ errors, ...rest }) => rest);
    const removeItemsSequenceNumbers = removeItemsErrors.map(({ sequenceNumber, ...rest }) => rest);
    const changedItems = this.changeKeysName(removeItemsSequenceNumbers);
    this.employeeUploadProcessor.uploadEmployeesList(changedItems, this.currentUserId).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.isLoading = false;
          this.loadSuccess = true;
        } else {
          this.isLoading = false;
          this.loadFailure = true;
          console.error('Unexpected Response Status:', response.status);
        }
      },
      error: (err) => {
        console.error('Error Response:', err);
        if (err instanceof HttpErrorResponse) {
          console.error('Error Status Code:', err.status);
          console.error('Error Message:', err.message);
          this.isLoading = false;
          this.loadFailure = true;
        } else {
          console.error('Unknown Error:', err);
          this.isLoading = false;
          this.loadFailure = true;
        }
      }
    });
  }

  public getCurrentProviderId(): Observable<any> {
    return this.providerService.getProfile().pipe(map((data) => data.id));
  }

  public cleanup(): void {
    this.resetValues();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

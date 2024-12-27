import { Component } from '@angular/core';
import { ImportValidationService } from 'shared/services/import-validation/import-validation.service';
import { FieldsConfig } from 'shared/models/admin-import-export.model';
import { ExcelUploadProcessorService } from 'shared/services/excel-upload-processor/excel-upload-processor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-providers',
  template: '<div></div>',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent<ImitatorInterface extends { errors: unknown; sequenceNumber: unknown }> {
  public extendsComponentConfig: FieldsConfig[];
  public isToggle: boolean;
  public isLoading = false;

  public isWarningVisible: boolean = false;
  public selectedFile: any = null;
  public isGoTopBtnVisible: boolean;
  public columnNamesBase: string[];
  public standardHeadersBase: string[];
  public readonly topPosToStartShowing: number = 250;

  public dataSource: ImitatorInterface[];
  public dataSourceInvalid: ImitatorInterface[];
  private subscription: Subscription;
  constructor(
    private readonly importValidationService: ImportValidationService,
    private readonly excelService: ExcelUploadProcessorService
  ) {}

  public initializeLoadingObserver(): void {
    // Підписка на isLoading$
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
        console.log('Отримані дані:', items);
        this.processProvidersData(items);
      },
      error: (err) => {
        console.error('Помилка при конвертації Excel:', err);
      },
      complete: () => {
        console.log('Обробка завершена');
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

  public sendValidProviders(): void {
    const removeItemsErrors = this.dataSource.map(({ errors, ...rest }) => rest);
    const removeItemsSequenceNumbers = removeItemsErrors.map(({ sequenceNumber, ...rest }) => rest);
    console.log(removeItemsSequenceNumbers);
  }

  public cleanup(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

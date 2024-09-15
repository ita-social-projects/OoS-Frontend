import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'ngx-window-token';
import * as XLSX from 'xlsx/xlsx.mjs';
import { ImportValidationService } from 'shared/services/admin-import-export/import-validation/import-validation.service';

@Component({
  selector: 'app-import-providers',
  template: '<div></div>',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent {
  public isToggle: boolean;
  public isLoading: boolean = false;
  public isWarningVisible: boolean = false;
  public selectedFile: any = null;
  public isGoTopBtnVisible: boolean;
  public columnNamesBase: string[];
  public standardHeadersBase: string[];
  public readonly topPosToStartShowing: number = 250;

  public dataSource: any[];
  public dataSourceInvalid: any[];

  constructor(
    private importValidationService: ImportValidationService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window
  ) {}

  @HostListener('window:scroll')
  public checkScroll(): void {
    const scrollPosition = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isGoTopBtnVisible = true;
    } else {
      this.isGoTopBtnVisible = false;
    }
  }

  public gotoTop(): void {
    this.window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  public setColumnNames(columnNames: string[]): void {
    this.columnNamesBase = columnNames;
  }

  public setStandardHeaders(headers: string[]): void {
    this.standardHeadersBase = headers;
  }

  // 2
  public resetValues(): void {
    this.dataSource = null;
    this.dataSourceInvalid = null;
    this.isToggle = false;
    this.isWarningVisible = false;
    console.log('reset works');
  }

  // 3
  public convertExcelToJSON(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onerror = (): void => {
      alert(this.translate.instant('IMPORT/EXPORT.FILE_READER_WARNING'));
    };
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any): void => {
      try {
        const binaryString = new Uint8Array(e.target.result);
        const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'array', WTF: true, raw: true, cellFormula: false });
        const wsname = workBook.SheetNames[0];
        const currentHeaders = this.getCurrentHeaders(workBook, wsname);
        if (this.checkHeadersIsValid(currentHeaders)) {
          const items = this.getProvidersData(workBook, wsname);
          console.log(items);
          this.processProvidersData(items);
        }
      } catch (error) {
        alert(this.translate.instant('IMPORT/EXPORT.FILE_READER_WARNING'));
        this.isLoading = false;
      }
    };
  }

  public getCurrentHeaders(workBook: XLSX.WorkBook, wsname: string): any[] {
    return XLSX.utils.sheet_to_json(workBook.Sheets[wsname], { header: 1 }).shift();
  }

  /**
   * This method get providers from .xlsx file.
   * The "header" option sets the correspondence between the key in the object and the header
   * in the file (header:Director`s name = key:directorsName)the order is strict
   * Provider[] changed to any[]
   * @returns array of objects,each object is provider`s data
   */
  // rewrite this method in child component
  public getProvidersData(workBook: XLSX.WorkBook, wsname: string): any[] {
    return XLSX.utils.sheet_to_json(workBook.Sheets[wsname], {
      header: this.columnNamesBase,
      range: 1
    });
  }

  /**
   * This method process array of providers
   * 1. check array length ,proper length 100
   * 2. define ID key to each provider
   * @param items
   */
  public processProvidersData(items: any[]): void {
    const isArrayTruncated = this.showsIsTruncated(items);
    const itemsId: any[] = items.map((elem, index) => ({ ...elem, id: index }));
    this.handleData(itemsId, isArrayTruncated);
  }

  /**
   * This method process array of providers
   * @param emailsEdrpous - response after verification
   * @param providers - providers with ID
   * @param isArrayTruncated - indicates whether the array was truncated
   */
  public handleData(items: any[], isArrayTruncated: boolean): void {
    this.importValidationService.checkForInvalidData(items);
    this.dataSource = items;
    this.dataSourceInvalid = this.filterInvalidItems(items);
    this.isLoading = false;
    this.isWarningVisible = isArrayTruncated;
  }

  // 1
  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files[0];
    this.isLoading = true;
    this.resetValues();
    this.convertExcelToJSON(this.selectedFile);
    target.value = '';
  }

  public filterInvalidItems(items: any[]): any {
    return items.filter((elem) => Object.values(elem.errors).find((error) => error !== null));
  }

  public checkHeadersIsValid(currentHeaders: string[]): boolean {
    const isValid = this.standardHeadersBase.every((header, index) => currentHeaders[index].trim() === header);
    if (!isValid) {
      this.isLoading = false;
      const invalidHeader = currentHeaders.find((header, index) => header !== this.standardHeadersBase[index]);
      alert(
        `${this.translate.instant('IMPORT/EXPORT.FILE_HEADERS_WARNING')}"${invalidHeader}",\n\nЗразок:\n${this.standardHeadersBase.join(' | ')}`
      );
    }
    return isValid;
  }

  // 1
  public showsIsTruncated(item: any[]): boolean {
    const cutItems = item.splice(100, item.length);
    return Boolean(cutItems.length);
  }

  public sendValidProviders(): void {
    // const requestProvider: ValidProviders[] = this.dataSource.map(({ errors, ...rest }) => rest);
    // this.importService.postProviders(requestProvider);
  }
}

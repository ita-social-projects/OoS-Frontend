import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx/xlsx.mjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelUploadProcessorService {
  constructor(public readonly translate: TranslateService) {}

  public convertExcelToJSON(file: File, standartHeadersBase: string[], columnNamesBase: string[]): Observable<any[]> {
    return new Observable((observer) => {
      const reader: FileReader = new FileReader();
      reader.onerror = (): void => {
        this.showAlert(this.translate.instant('IMPORT/EXPORT.FILE_READER_WARNING'));
        observer.error(this.translate.instant('IMPORT/EXPORT.FILE_READER_ERROR'));
      };

      reader.onload = (e: any): void => {
        try {
          const binaryString = new Uint8Array(e.target.result);
          const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'array', WTF: true, raw: true, cellFormula: false });
          const wsname = workBook.SheetNames[0];
          const currentHeaders = this.getCurrentHeaders(workBook, wsname);
          if (this.checkHeadersIsValid(currentHeaders, standartHeadersBase)) {
            const items = this.getItemsData(workBook, wsname, columnNamesBase) as unknown as any[];
            observer.next(items);
            observer.complete();
          } else {
            observer.error(this.translate.instant('IMPORT/EXPORT.FILE_HEADERS_ERROR'));
          }
        } catch (error) {
          this.showAlert(this.translate.instant('IMPORT/EXPORT.FILE_READER_WARNING'));
          observer.error(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  public getCurrentHeaders(workBook: XLSX.WorkBook, wsname: string): string[] {
    return XLSX.utils.sheet_to_json(workBook.Sheets[wsname], { header: 1 }).shift();
  }

  /**
   * This method get providers from .xlsx file.
   * The "header" option sets the correspondence between the key in the object and the header
   * in the file (header:Director`s name = key:directorsName)the order is strict
   * @returns array of objects,each object is provider`s data
   */
  public getItemsData(workBook: XLSX.WorkBook, wsname: string, columnNamesBase: string[]): any[] {
    return XLSX.utils.sheet_to_json(workBook.Sheets[wsname], {
      header: columnNamesBase,
      range: 1
    });
  }

  public checkHeadersIsValid(currentHeaders: string[], standartHeadersBase: string[]): boolean {
    const isValid = standartHeadersBase.every((header, index) => {
      const currentHeader = currentHeaders[index];
      return currentHeader && currentHeader.trim() === header;
    });
    if (!isValid) {
      const invalidHeader = currentHeaders.find((header, index) => {
        const currentHeader = header || '';
        return currentHeader.trim() !== standartHeadersBase[index];
      });
      const headerMessage = invalidHeader ? invalidHeader : this.translate.instant('IMPORT/EXPORT.FILE_EMPTY_HEADER_WARNING');
      this.showAlert(
        `${this.translate.instant('IMPORT/EXPORT.FILE_HEADERS_WARNING')}"${headerMessage}",
        \n\n${this.translate.instant('IMPORT/EXPORT.FILE_HEADERS_EXAMPLE')}:\n${standartHeadersBase.join(' | ')}`
      );
    }
    return isValid;
  }

  public showAlert(message: string): void {
    alert(message);
  }
}

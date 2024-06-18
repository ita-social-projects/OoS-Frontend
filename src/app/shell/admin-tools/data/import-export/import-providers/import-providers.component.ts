import { Component, HostListener, Inject } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { ImportValidationService } from 'shared/services/admin-import-export/import-validation/import-validation.service';
import { EmailsEdrpous, EmailsEdrpousResponse, Providers, ProvidersID, ValidProviders } from 'shared/models/admin-import-export.model';
import { EDRPOU_IPN_REGEX, EMAIL_REGEX } from 'shared/constants/regex-constants';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'ngx-window-token';
import { ImportProvidersColumnsName, ImportProvidersStandardHeaders } from 'shared/enum/enumUA/tech-admin/import-export';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent {
  public isToggle: boolean;
  public isLoading: boolean = false;
  public isWarningVisible: boolean = false;
  public selectedFile: any = null;
  public isGoTopBtnVisible: boolean;
  public readonly topPosToStartShowing: number = 250;
  public readonly displayedColumns: string[] = Object.values(ImportProvidersColumnsName);
  public dataSource: ProvidersID[];
  public dataSourceInvalid: ProvidersID[];

  constructor(
    private importService: AdminImportExportService,
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

  public resetValues(): void {
    this.dataSource = null;
    this.dataSourceInvalid = null;
    this.isToggle = false;
    this.isWarningVisible = false;
  }

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
          const providers = this.getProvidersData(workBook, wsname);
          this.processProvidersData(providers);
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

  public getProvidersData(workBook: XLSX.WorkBook, wsname: string): Providers[] {
    return XLSX.utils.sheet_to_json(workBook.Sheets[wsname], {
      header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
      range: 1
    });
  }

  public processProvidersData(providers: Providers[]): void {
    const isCorrectLength = this.showsIsTrimmed(providers);
    const providersId: ProvidersID[] = providers.map((elem, index) => ({ ...elem, id: index }));
    this.verifyEmailsEdrpous(providersId).subscribe((emailsEdrpous) => {
      this.handleData(emailsEdrpous, providersId, isCorrectLength);
    });
  }

  public handleData(emailsEdrpous: EmailsEdrpousResponse, providers: ProvidersID[], isCorrectLength: boolean): void {
    this.importValidationService.checkForInvalidData(providers, emailsEdrpous);
    this.dataSource = providers;
    this.dataSourceInvalid = this.filterInvalidProviders(providers);
    this.isLoading = false;
    this.isWarningVisible = isCorrectLength;
  }
  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files[0];
    this.isLoading = true;
    this.resetValues();
    this.convertExcelToJSON(this.selectedFile);
    target.value = '';
  }

  public verifyEmailsEdrpous(providers: ProvidersID[]): Observable<EmailsEdrpousResponse> {
    const emailsEdrpous: EmailsEdrpous = providers.reduce(
      (acc, element) => {
        if (element.identifier && EDRPOU_IPN_REGEX.test(element.identifier.toString())) {
          acc.edrpous[element.id] = element.identifier;
        }
        if (element.email && EMAIL_REGEX.test(element.email)) {
          acc.emails[element.id] = element.email;
        }
        return acc;
      },
      { edrpous: {}, emails: {} }
    );
    return this.importService.sendEmailsEDRPOUsForVerification(emailsEdrpous);
  }

  public filterInvalidProviders(providers: ProvidersID[]): any {
    return providers.filter((elem) => Object.values(elem.errors).find((error) => error !== null));
  }
  public checkHeadersIsValid(currentHeaders: string[]): boolean {
    const standardHeaders: string[] = Object.values(ImportProvidersStandardHeaders);
    const isValid = standardHeaders.every((header, index) => currentHeaders[index].trim() === header);
    if (!isValid) {
      this.isLoading = false;
      const invalidHeader = currentHeaders.find((header, index) => header !== standardHeaders[index]);
      alert(
        `${this.translate.instant('IMPORT/EXPORT.FILE_HEADERS_WARNING')}"${invalidHeader}",\n\nЗразок:\n${standardHeaders.join(' | ')}`
      );
    }
    return isValid;
  }

  public showsIsTrimmed(providers: Providers[]): boolean {
    const cutProviders = providers.splice(100, providers.length);
    return cutProviders.length > 0;
  }

  public sendValidProviders(): void {
    // const requestProvider: ValidProviders[] = this.dataSource.map(({ errors, ...rest }) => rest);
    // this.importService.postProviders(requestProvider);
  }
}

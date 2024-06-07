/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, HostListener } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { ImportValidationService } from 'shared/services/admin-import-export/import-validation/import-validation.service';
import { IEmailsEdrpous, IEmailsEdrpousResponse, IProviders, IProvidersID } from 'shared/models/admin-import-export.model';
import { EDRPOU_IPN_REGEX, EMAIL_REGEX } from 'shared/constants/regex-constants';
import { Observable } from 'rxjs';

// let 60str = 'йцукенгшщзхїфівапролджєйцукеншщзхїєждлорпавіфйцукенгшщзхїєж'
// const data = [
//   {
//     providerName: 'Клуб спортивного бального танцю',
//     ownership: 'Державна',
//     identifier: 12345678,
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   },
//   {
//     providerName: 'ТОВ Олімп',
//     ownership: 'Державна',
//     identifier: 87654321,
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   },
//   {
//     providerName: 'ТОВ Олімп',
//     ownership: 'Державна',
//     identifier: 1234567,
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   },
//   {
//     providerName: 'ТОВ Олімп',
//     ownership: 'Державна',
//     identifier: 87654321,
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   },
//   {
//     providerName: 'ТОВ Олімп',
//     ownership: 'Державна',
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   },
//   {
//     providerName: 'ТОВ Олімп',
//     ownership: 'Державна',
//     identifier: 87654321,
//     licenseNumber: 'не вказано',
//     settlement: 'Луцьк',
//     address: 'Шевченка 2',
//     email: 'some@gmail.com',
//     phoneNumber: 660666066
//   }
// ];

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent {
  public isToggle: boolean;
  public isWaiting: boolean = false;
  public isWarningVisible: boolean = false;
  public selectedFile: any = null;
  public isGoTopBtnVisible: boolean;
  public readonly topPosToStartShowing: number = 250;
  public readonly displayedColumns: string[] = [
    'sequence number',
    'provider name',
    'ownership',
    'identifier',
    'license number',
    'settlement',
    'address',
    'email',
    'phone number'
  ];
  public dataSource: IProvidersID[];
  public dataSourceInvalid: IProvidersID[];

  constructor(
    private importService: AdminImportExportService,
    private importValidationService: ImportValidationService
  ) {}
  @HostListener('window:scroll')
  public checkScroll(): void {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isGoTopBtnVisible = true;
    } else {
      this.isGoTopBtnVisible = false;
    }
  }

  public gotoTop(): void {
    window.scroll({
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

  public convertExcelToJSON(event: any): void {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any): void => {
      const binarystring = new Uint8Array(e.target.result);
      const wb: XLSX.WorkBook = XLSX.read(binarystring, { type: 'array', WTF: true, raw: true, cellFormula: false });
      const wsname = wb.SheetNames[0];
      const currentHeaders = this.getCurrentHeaders(wb, wsname);
      if (this.checkHeadersIsValid(currentHeaders)) {
        const providers = this.getProvidersData(wb, wsname);
        this.processProvidersData(providers);
      }
    };
  }

  public getCurrentHeaders(wb: XLSX.WorkBook, wsname: string): any[] {
    return XLSX.utils.sheet_to_json(wb.Sheets[wsname], { header: 1 }).shift();
  }

  public getProvidersData(wb: XLSX.WorkBook, wsname: string): IProviders[] {
    return XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
      header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
      range: 1
    });
  }

  public processProvidersData(providers: IProviders[]): void {
    const isCorrectLength = this.cutArrayToHundred(providers);
    const setIdToProviders: IProvidersID[] = providers.map((elem, index) => ({ ...elem, id: index }));
    this.verifyEmailsEdrpous(setIdToProviders).subscribe((emailsEdrpous) => {
      this.handleData(emailsEdrpous, setIdToProviders, isCorrectLength);
    });
  }

  public handleData(emailsEdrpous: IEmailsEdrpousResponse, providers: IProvidersID[], isCorrectLength: boolean): void {
    this.importValidationService.checkForInvalidData(providers, emailsEdrpous);
    this.dataSource = providers;
    this.dataSourceInvalid = this.filterInvalidProviders(providers);
    this.isWaiting = false;
    this.isWarningVisible = isCorrectLength;
  }
  // -----------------------------------------------------------------
  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.isWaiting = true;
    this.resetValues();
    this.convertExcelToJSON(event);
    event.target.value = '';
  }

  public verifyEmailsEdrpous(providers: IProvidersID[]): Observable<IEmailsEdrpousResponse> {
    const emailsEdrpous: IEmailsEdrpous = providers.reduce(
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

  public filterInvalidProviders(providers: IProvidersID[]): any {
    return providers.filter((elem) => Object.values(elem.errors).find((error) => error !== null));
  }
  public checkHeadersIsValid(currentHeaders: string[]): boolean {
    const standardHeaders = [
      'Назва закладу',
      'Форма власності',
      'ЄДРПОУ',
      'Ліцензія №',
      'Населений пункт',
      'Адреса',
      'Електронна пошта',
      'Телефон'
    ];
    const isValid = standardHeaders.every((header, index) => currentHeaders[index].trim() === header);
    if (!isValid) {
      this.isWaiting = false;
      const invalidHeader = currentHeaders.find((header, index) => header !== standardHeaders[index]);
      alert(`Невідповідність в заголовку "${invalidHeader}",\n\nЗразок:\n${standardHeaders.join(' | ')}`);
    }
    return isValid;
  }

  public cutArrayToHundred(providers: IProviders[]): boolean {
    const cutProviders = providers.splice(100, providers.length);
    return cutProviders.length > 0;
  }
}

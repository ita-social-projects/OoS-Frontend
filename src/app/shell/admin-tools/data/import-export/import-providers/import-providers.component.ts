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
      const currentHeaders = XLSX.utils.sheet_to_json(wb.Sheets[wsname], { header: 1 }).shift();
      if (this.checkHeadersIsValid(currentHeaders)) {
        const providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
          header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
          range: 1
        });
        console.log(providers);
        const isCorrectLength = this.cutArrayToHundred(providers);
        providers.forEach((elem) => {
          elem.id = providers.indexOf(elem);
        });
        this.verifyEmailsEdrpous(providers).subscribe((emailsEdrpous) => {
          console.log(emailsEdrpous);
          this.importValidationService.checkForInvalidData(providers, emailsEdrpous);
          this.dataSource = providers;
          this.dataSourceInvalid = this.filterInvalidProviders(providers);
          this.isWaiting = false;
          this.isWarningVisible = this.cutArrayToHundred(providers);
          this.isWarningVisible = isCorrectLength;
        });
      }
    };
  }

  //   public convertExcelToJSON(event: any): void {
  //     const file = this.getFileFromEvent(event);
  //     const reader = this.createFileReader(file);
  //     reader.onload = (e: any): void => {
  //       const binarystring = new Uint8Array(e.target.result);
  //       const wb = this.readWorkbook(binarystring);
  //       const wsname = wb.SheetNames[0];
  //       const currentHeaders = this.getCurrentHeaders(wb, wsname);
  //       if (this.checkHeadersIsValid(currentHeaders)) {
  //         const providers = this.parseProviders(wb, wsname);
  //         this.processProviders(providers);
  //       }
  //     };
  //   }

  //   private getFileFromEvent(event: any): File {
  //     return event.target.files[0];
  //   }

  //   private createFileReader(file: File): FileReader {
  //     const reader: FileReader = new FileReader();
  //     reader.readAsArrayBuffer(file);
  //     return reader;
  //   }

  //   private readWorkbook(binarystring: Uint8Array): XLSX.WorkBook {
  //     return XLSX.read(binarystring, { type: 'array', WTF: true, raw: true, cellFormula: false });
  //   }

  //   private getCurrentHeaders(workbook: XLSX.WorkBook, sheetName: string): string[] {
  //     return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }).shift();
  //   }

  //   private parseProviders(workbook: XLSX.WorkBook, sheetName: string): IProviderID[] {
  //     return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
  //       header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
  //       range: 1
  //     }) as IProviderID[];
  //   }

  //   private processProviders(providers: IProviderID[]): void {
  //     const isCorrectLength = this.cutArrayToHundred(providers);
  //     providers.forEach((elem, index) => {
  //       elem.id = index;
  //     });
  //     this.verifyEmailsEdrpous(providers).subscribe((emailsEdrpous) => {
  //       this.checkForInvalidData(providers, emailsEdrpous);
  //       this.dataSource = providers;
  //       console.log(this.dataSource);
  //       this.dataSourceInvalid = this.filterInvalidProviders(providers);
  //       this.isWaiting = false;
  //       this.isWarningVisible = isCorrectLength;
  //     });
  //   }

  //   // The following methods are assumed to be implemented elsewhere
  //   private checkHeadersIsValid(headers: string[]): boolean {
  //     // Assume this method is implemented elsewhere
  //     return true;
  //   }

  //   private cutArrayToHundred(providers: IProviderID[]): boolean {
  //     // Assume this method is implemented elsewhere
  //     return providers.length <= 100;
  //   }

  //   private verifyEmailsEdrpous(providers: IProviderID[]): any {
  //     // Assume this method is implemented elsewhere
  //     // Return an observable or a promise (depends on your implementation)
  //     return {
  //       subscribe: (callback: (emailsEdrpous: any) => void) => {
  //         callback([]); // Placeholder implementation
  //       }
  //     };
  //   }

  //   private checkForInvalidData(providers: IProviderID[], emailsEdrpous: any): void {
  //     // Assume this method is implemented elsewhere
  //   }

  //   private filterInvalidProviders(providers: IProviderID[]): IProviderID[] {
  //     // Assume this method is implemented elsewhere
  //     return providers.filter((elem) => Object.values(elem.errors || {}).find((e) => e !== null));
  //   }
  // }

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
    console.log(emailsEdrpous);
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

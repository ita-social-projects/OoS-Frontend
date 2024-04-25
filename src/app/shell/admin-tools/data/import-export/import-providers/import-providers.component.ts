/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, HostListener, OnInit } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AdminImportExportService } from 'shared/services/admin-import-export/admin-import-export.service';
import { EDRPOU_IPN_REGEX, EMAIL_REGEX, NO_LATIN_REGEX, STREET_REGEX } from 'shared/constants/regex-constants';

const standartHeaders = [
  'Назва закладу ',
  'Форма власності',
  'ЄДРПОУ',
  'Ліцензія №',
  'Населений пункт',
  'Адреса',
  'Електронна пошта',
  'Телефон'
];


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
export class ImportProvidersComponent implements OnInit {
  public isToggle: boolean;
  public isWaiting: boolean = false;
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
  public dataSource;
  public dataSourceInvalid = [];

  constructor(private importService: AdminImportExportService) { }
  ngOnInit(): void { }

  @HostListener('window:scroll')
  checkScroll(): void {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isGoTopBtnVisible = true;
    } else {
      this.isGoTopBtnVisible = false;
    }
  }

  gotoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  resetValues(): void {
    this.dataSource = null;
    this.dataSourceInvalid = null;
    this.isToggle = false;
  }

  public convertExcelToJSON(event: any): void {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      const binarystring = new Uint8Array(e.target.result);
      const wb: XLSX.WorkBook = XLSX.read(binarystring, { type: 'array', WTF: true, raw: true, cellFormula: false });
      const wsname = wb.SheetNames[0];
      const currentHeaders = XLSX.utils.sheet_to_json(wb.Sheets[wsname], { header: 1 }).shift();
      const fileLength = XLSX.utils.sheet_to_json(wb.Sheets[wsname]).length;
      if (this.checkHeadersIsValid(currentHeaders, fileLength)) {
        const providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
          header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
          range: 1
        });
        providers.forEach(elem => {
          elem.id = providers.indexOf(elem);
        });
        this.verifyEmailsEdrpous(providers).subscribe(data => {
          console.log(data);
          this.checkForInvalidData(providers, data);
          this.dataSource = providers;
          this.dataSourceInvalid = this.filterInvalidProviders(providers);
          this.isWaiting = false;
        });
      }
    };
  }

  verifyEmailsEdrpous(providers: any): any {
    const emailsEdrpous = {
      edrpous: {},
      emails: {}
    };
    for (let i = 0; i < providers.length; i++) {
      if (providers[i].identifier && EDRPOU_IPN_REGEX.test(providers[i].identifier)) {
        emailsEdrpous.edrpous[providers[i].id] = providers[i].identifier;
      }
      if (providers[i].email && EMAIL_REGEX.test(providers[i].email)) {
        emailsEdrpous.emails[providers[i].id] = providers[i].email;
      }
    }
    console.log(emailsEdrpous);
    return this.importService.sendEmailsEDRPOUsForVerification(emailsEdrpous);
  }

  public onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.isWaiting = true;
    this.resetValues();
    this.convertExcelToJSON(event);
    event.target.value = '';
  }

  public checkForInvalidData(providers: any[], emailsEdrpous: any): any {
    return providers.forEach((elem) => {
      elem.errors = {};
      // Provider name required, min/max length check
      if (!elem.providerName) {
        elem.errors.providerNameEmpty = true;
      } else if (elem.providerName.length <= 1 || elem.providerName.length > 60) {
        elem.errors.providerNameLength = true;
      }
      // Ownership required
      if (!elem.ownership) {
        elem.errors.ownershipEmpty = true;
      }
      // EDRPOU IPN required, format, duplicate
      if (!elem.identifier) {
        elem.errors.identifierEmpty = true;
      } else if (!EDRPOU_IPN_REGEX.test(elem.identifier)) {
        elem.errors.identifierFormat = true;
      } else if (emailsEdrpous.edrpous.includes(elem.id)) {
        elem.errors.identifierDuplicate = true;
      }
      // License required----
      if (!elem.licenseNumber) {
        elem.errors.licenseNumberEmpty = true;
      }
      // Settlement required, min/max length check, language
      if (!elem.settlement) {
        elem.errors.settlementEmpty = true;
      } else if (elem.settlement.length <= 1 || elem.settlement.length > 60) {
        elem.errors.settlementLength = true;
      } else if (!NO_LATIN_REGEX.test(elem.settlement)) {
        elem.errors.settlementLanguage = true;
      }
      // Address required, language
      if (!elem.address) {
        elem.errors.addressEmpty = true;
      } else if (!STREET_REGEX.test(elem.address)) {
        elem.errors.addressLanguage = true;
      }
      // Email required, format, duplicate
      if (!elem.email) {
        elem.errors.emailEmpty = true;
      } else if (!EMAIL_REGEX.test(elem.email)) {
        elem.errors.emailFormat = true;
      } else if (emailsEdrpous.emails.includes(elem.id)) {
        elem.errors.emailDuplicate = true;
      }
      // Phone number required, format
      if (!elem.phoneNumber) {
        elem.errors.phoneNumberEmpty = true;
      } else if (!(/^\d+$/).test(elem.phoneNumber)) {
        elem.errors.phoneNumberFormat = true;
      }
    });
  }

  public filterInvalidProviders(providers: any[]): any {
    return providers.filter((elem) => Object.values(elem.errors).find(e => e !== null));
  }
  public checkHeadersIsValid(currentHeaders: string[], fileLength: number): boolean {
    for (let i = 0; i < standartHeaders.length; i++) {
      if (currentHeaders[i] !== standartHeaders[i]) {
        this.isWaiting = false;
        setTimeout(() => alert(`невідповідність в заголовку "${currentHeaders[i]}",

        Зразок:
        Назва закладу | Форма власності | ЄДРПОУ | Ліцензія № |
        Населений пункт | Адреса | Електронна пошта | Телефон`));
        return false;
      }
      if (fileLength > 100) {
        this.isWaiting = false;
        setTimeout(() => alert('Файл має містити не більше 100 рядків не включаючи заголовків'));
        return false;
      }
    }
    return true;
  }
}
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, HostListener, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx/xlsx.mjs';
import { AdminImportExportService, IEmailsEdrpous } from 'shared/services/admin-import-export/admin-import-export.service';

const standartHeaders = [
  'Назва закладу ',
  'Форма власності',
  'ЄДРПОУ/ІПН',
  'Ліцензія №',
  'Населений пункт',
  'Адреса',
  'Електронна пошта',
  'Телефон'
];

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
  public currentPage = 0;
  public pageSize = 25;
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
      if (this.checkHeadersIsValid(currentHeaders)) {
        const providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
          header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
          range: 1
        });
        // this.verifyEmailsEdrpous(providers).subscribe(data => {
        //   this.checkForInvalidData(providers);
        //   this.dataSource = providers;
        //   this.dataSourceInvalid = this.filterInvalidProviders(providers);
        //   this.isWaiting = false;
        // });
         setTimeout(() =>this.verifyEmailsEdrpous(providers).subscribe(data => {
          console.log(data);
          this.checkForInvalidData(providers);
          this.dataSource = providers;
          this.dataSourceInvalid = this.filterInvalidProviders(providers);
          this.isWaiting = false;
        }), 2000);
      }
    };
  }

  verifyEmailsEdrpous(providers: any): any {
    const emailsEdrpous: IEmailsEdrpous = {
      edrpous: [],
      emails: []
    };
    providers.forEach((elem) => {
      emailsEdrpous.emails.push(elem.email);
      emailsEdrpous.edrpous.push(elem.identifier ? elem.identifier.toString() : '');
    });
    return this.importService.sendEmailsEDRPOUsForVerification(emailsEdrpous);
    // console.log(emailsEdrpous);
  }



  public onFileSelected(event: any) {
    this.isWaiting = true;
    this.resetValues();
    this.selectedFile = event.target.files[0] ?? null;
    this.convertExcelToJSON(event);
  }

  // public checkForInvalidData(providers: any[]): any {
  //   return providers.forEach((elem) => {
  //     elem.errors = {
  //       providerName: !elem.providerName?elem.providerName || ' ':null,
  //       ownership: !elem.ownership?elem.ownership || ' ':null,
  //       identifier: ( !elem.identifier || elem.identifier?.toString().length !== 8 )?elem.identifier || ' ':null,
  //       licenseNumber:!elem.licenseNumber?elem.licenseNumber || ' ':null,
  //       settlement:!elem.settlement?elem.settlement || ' ':null,
  //       address:!elem.address?elem.address || ' ':null,
  //       email:!elem.email?elem.email || ' ':null,
  //       phoneNumber:(!elem.phoneNumber || elem.phoneNumber?.toString().length !== 9 )?elem.phoneNumber || ' ':null
  //     };
  //     console.log(elem);
  //   });
  // }


  // alternative ------------------------------------------------------------------------------

  public checkForInvalidData(providers: any[]): any {
    return providers.forEach((elem) => {
      elem.errors = {};
      !elem.providerName ? elem.errors.providerName = elem.providerName || ' ' : null;
      !elem.ownership ? elem.errors.ownership = elem.ownership || ' ' : null;
      !elem.identifier || elem.identifier?.toString().length !== 8 ? elem.errors.identifier = elem.identifier || ' ' : null;
      !elem.licenseNumber ? elem.errors.licenseNumber = elem.licenseNumber || ' ' : null;
      !elem.settlement ? elem.errors.settlement = elem.settlement || ' ' : null;
      !elem.address ? elem.errors.address = elem.address || ' ' : null;
      !elem.email ? elem.errors.email = elem.email || ' ' : null;
      !elem.phoneNumber ? elem.errors.phoneNumber = elem.phoneNumber || ' ' : null;
      // console.log(elem);
    });
  }
  // alternative ------------------------------------------------------------------------------

  public filterInvalidProviders(providers: any[]): any {
    return providers.filter((elem) => Object.values(elem.errors).find(e => e !== null));
  }
  public checkHeadersIsValid(currentHeaders: string[]): boolean {
    for (let i = 0; i < standartHeaders.length; i++) {
      if (currentHeaders[i] !== standartHeaders[i]) {
        alert(`невідповідність в заголовку "${currentHeaders[i]}",

        Зразок:
        Назва закладу | Форма власності | ЄДРПОУ/ІПН | Ліцензія № |
        Населений пункт | Адреса | Електронна пошта | Телефон`);
        return false;
      }
    }
    return true;
  }

  onPageChange(event: PageEvent): void {
    console.log(event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.dataSource.slice(start, end);
    this.dataSource = part;
  }

}

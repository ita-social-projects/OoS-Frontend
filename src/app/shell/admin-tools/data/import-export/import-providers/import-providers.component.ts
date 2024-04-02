/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, HostListener, OnInit } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';

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

const data = [
  {
    providerName: 'Клуб спортивного бального танцю',
    ownership: 'Державна',
    identifier: 12345678,
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  },
  {
    providerName: 'ТОВ Олімп',
    ownership: 'Державна',
    identifier: 87654321,
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  },
  {
    providerName: 'ТОВ Олімп',
    ownership: 'Державна',
    identifier: 1234567,
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  },
  {
    providerName: 'ТОВ Олімп',
    ownership: 'Державна',
    identifier: 87654321,
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  },
  {
    providerName: 'ТОВ Олімп',
    ownership: 'Державна',
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  },
  {
    providerName: 'ТОВ Олімп',
    ownership: 'Державна',
    identifier: 87654321,
    licenseNumber: 'не вказано',
    settlement: 'Луцьк',
    address: 'Шевченка 2',
    email: 'some@gmail.com',
    phoneNumber: 660666066
  }
];

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent implements OnInit {
  public isToggle: boolean;
  public selectedFile: any = null;
  public isShow: boolean;
  public readonly topPosToStartShowing: number = 250;
  public readonly displayedColumns: string[] = [
    'sequence number',
    'sequence number in file',
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
  public dataSourceInvalid;

  @HostListener('window:scroll')
  checkScroll(): void {
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  gotoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  constructor() {}
  ngOnInit(): void {}

  public onFileSelected(event: any): any {
    this.dataSource = null;
    this.dataSourceInvalid = null;
    this.isToggle = false;
    this.selectedFile = event.target.files[0] ?? null;
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      const binarystring = new Uint8Array(e.target.result);
      const wb: XLSX.WorkBook = XLSX.read(binarystring, { type: 'array', WTF: true, raw: true, cellFormula: false });
      const wsname = wb.SheetNames[0];
      const currentHeaders = XLSX.utils.sheet_to_json(wb.Sheets[wsname], { header: 1 }).shift();
      if (this.checkHeadersForValid(currentHeaders)) {
        const providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
          header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
          range: 1
        });

        this.dataSource = providers;
        this.dataSourceInvalid = this.checkForInvalidProviders(providers);
      }
    };
  }
  public checkForInvalidProviders(providers: any[]): any {
    return providers.filter(
      (elem) => !elem.identifier || elem.identifier.toString().length !== 8 || !elem.ownership || !elem.licenseNumber || !elem.settlement
    );
  }

  public checkHeadersForValid(currentHeaders: string[]): boolean {
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
}

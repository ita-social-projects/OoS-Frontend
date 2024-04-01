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

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent implements OnInit {
  public selectedFile: any = null;
  public isShow: boolean;
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
      }
    };
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

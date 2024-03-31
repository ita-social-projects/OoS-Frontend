import { Component, HostListener, OnInit } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 250;

  @HostListener('window:scroll')
  checkScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  public selectedFile: any = null;

  displayedColumns: string[] = [
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

  constructor() {}
  ngOnInit(): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onFileSelected(event: any): any {
    this.selectedFile = event.target.files[0] ?? null;
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.readAsArrayBuffer(file);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    reader.onload = (e: any) => {
      const binarystring = new Uint8Array(e.target.result);
      const wb: XLSX.WorkBook = XLSX.read(binarystring, { type: 'array', raw: true, cellFormula: false });
      const wsname = wb.SheetNames[0];
      const providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname], {
        header: ['providerName', 'ownership', 'identifier', 'licenseNumber', 'settlement', 'address', 'email', 'phoneNumber'],
        range: 1
      });
      this.dataSource = providers;
      console.log(providers);
    };
  }
}

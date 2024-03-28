import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent implements OnInit {
  public providers: any[] = []; // set more specific type
  constructor() {}
  ngOnInit(): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onFileSelected(event: any): any {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.readAsArrayBuffer(file);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    reader.onload = (e: any) => {
      // upload file
      const binarystr = new Uint8Array(e.target.result);
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'array', raw: true, cellFormula: false });
      // console.log(wb.Sheets);

      const wsname = wb.SheetNames[0];
      this.providers = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
      console.log(this.providers);
    };
  }
  // selectedFile: any = null;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // public onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0] ?? null;
  //   console.log(event.target.files[0]);
  // }
}

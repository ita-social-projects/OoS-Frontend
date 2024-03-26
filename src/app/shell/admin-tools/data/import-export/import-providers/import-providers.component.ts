import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-providers',
  templateUrl: './import-providers.component.html',
  styleUrls: ['./import-providers.component.scss']
})
export class ImportProvidersComponent implements OnInit {
  public file!: any;
  public photo!: any;
  trustedUrl: any;
  constructor() {}
  ngOnInit(): void {}
  selectedFile: any = null;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    console.log(event.target.files[0]);
  }

  public showFile(): void {}
}

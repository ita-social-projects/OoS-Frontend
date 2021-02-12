import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

const materialComponent = [
  MatButtonModule,
  MatDialogModule,
];

@NgModule({
  declarations: [],
  exports: [
    materialComponent
  ],
})
export class MaterialModule { }

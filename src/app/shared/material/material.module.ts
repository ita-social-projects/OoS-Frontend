import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
const materialComponent = [
  MatButtonModule,
  MatDialogModule,
  MatSelectModule
];

@NgModule({
  declarations: [],
  exports: [
    materialComponent
  ],
})
export class MaterialModule {
}

import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

const materialComponent = [
  MatButtonModule,
  MatDialogModule,
  MatSelectModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  declarations: [],
  exports: [
    materialComponent
  ],
})
export class MaterialModule {
}

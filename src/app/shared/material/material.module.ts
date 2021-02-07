import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

const materialComponent = [
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule
];

@NgModule({
  declarations: [],
  exports: [
    materialComponent
  ],
})
export class MaterialModule { }

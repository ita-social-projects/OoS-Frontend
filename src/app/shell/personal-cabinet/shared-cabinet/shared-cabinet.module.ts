import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [
    ApplicationCardComponent,
    ApplicationsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ApplicationCardComponent,
    ApplicationsComponent,
  ]

})
export class SharedCabinetModule { }

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfoStatusComponent } from './applications/application-card/info-status/info-status.component';

@NgModule({
  declarations: [
    ApplicationCardComponent,
    ApplicationsComponent,
    InfoStatusComponent
  ],
  imports: [
    MaterialModule,
    SharedModule,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
  ],
  exports: [
    ApplicationsComponent,
  ]

})
export class SharedCabinetModule { }

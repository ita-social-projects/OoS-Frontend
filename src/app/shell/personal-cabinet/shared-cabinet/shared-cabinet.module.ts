import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfoStatusComponent } from './applications/application-card/info-status/info-status.component';
import { ChildInfoBoxComponent } from './applications/application-card/child-info-box/child-info-box.component';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ApplicationCardComponent,
    ApplicationsComponent,
    InfoStatusComponent,
    ChildInfoBoxComponent,
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

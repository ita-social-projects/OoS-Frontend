import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [ProviderListComponent],
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  exports: []
})
export class DataModule { }

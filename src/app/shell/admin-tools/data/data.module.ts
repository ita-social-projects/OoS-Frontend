import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsersComponent } from './users/users.component';
import { DataComponent } from './data.component';


@NgModule({
  declarations: [
    ProviderListComponent,
    UsersComponent,
    DataComponent,
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [DataComponent]
})
export class DataModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderListComponent } from './provider-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { AdminToolsModule } from '../admin-tools.module';

@NgModule({
  declarations: [ProviderListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    AdminToolsModule,
  ],
})
export class ProviderListModule {}

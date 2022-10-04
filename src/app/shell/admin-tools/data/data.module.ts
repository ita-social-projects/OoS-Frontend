import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRoutingModule } from './data-routing.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsersComponent } from './users/users.component';
import { DataComponent } from './data.component';
import { AdminsComponent } from './admins/admins.component';
import { CreateAdminComponent } from './admins/create-admin/create-admin.component';
import { HistoryLogComponent } from './history-log/history-log.component';
import { HistoryLogTableComponent } from './history-log-table/history-log-table.component';
import { HistoryLogFiltersComponent } from './history-log-filters/history-log-filters.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';

@NgModule({
  declarations: [
    ProviderListComponent,
    UsersComponent,
    DataComponent,
    AdminsComponent,
    CreateAdminComponent,
    HistoryLogComponent,
    HistoryLogTableComponent,
    HistoryLogFiltersComponent
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

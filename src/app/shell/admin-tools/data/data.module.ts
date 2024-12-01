import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedCabinetModule } from '../../personal-cabinet/shared-cabinet/shared-cabinet.module';
import { DataRoutingModule } from './data-routing.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { UsersComponent } from './users/users.component';
import { DataComponent } from './data.component';
import { AdminsComponent } from './admins/admins.component';
import { CreateAdminComponent } from './admins/create-admin/create-admin.component';
import { HistoryLogComponent } from './history-log/history-log.component';
import { HistoryLogTableComponent } from './history-log/history-log-table/history-log-table.component';
import { HistoryLogFiltersComponent } from './history-log/history-log-filters/history-log-filters.component';
import { DirectionsComponent } from './directions-wrapper/directions/directions.component';
import { CreateDirectionComponent } from './directions-wrapper/directions/create-direction/create-direction.component';
import { DirectionsWrapperComponent } from './directions-wrapper/directions-wrapper.component';
// eslint-disable-next-line max-len
import { DirectionsInstitutionHierarchiesListComponent } from './directions-wrapper/directions-institution-hierarchies-list/directions-institution-hierarchies-list.component';
import { AdminApplicationsComponent } from './admin-applications/admin-applications.component';
import { StatisticsComponent } from './statistics/statistics.component';
// eslint-disable-next-line max-len
import { DirectionsInstitutionHierarchiesEditFormComponent } from './directions-wrapper/directions-institution-hierarchies-edit-form/directions-institution-hierarchies-edit-form.component';

@NgModule({
  declarations: [
    ProviderListComponent,
    UsersComponent,
    DataComponent,
    AdminsComponent,
    CreateAdminComponent,
    HistoryLogComponent,
    HistoryLogTableComponent,
    HistoryLogFiltersComponent,
    DirectionsComponent,
    CreateDirectionComponent,
    DirectionsWrapperComponent,
    DirectionsInstitutionHierarchiesListComponent,
    AdminApplicationsComponent,
    StatisticsComponent,
    DirectionsInstitutionHierarchiesEditFormComponent
  ],
  imports: [CommonModule, DataRoutingModule, SharedModule, MaterialModule, TranslateModule, SharedCabinetModule],
  exports: [DataComponent]
})
export class DataModule {}

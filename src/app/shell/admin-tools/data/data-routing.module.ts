import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminApplicationsComponent } from './admin-applications/admin-applications.component';
import { AdminsComponent } from './admins/admins.component';
import { AdminsGuard } from './admins/admins.guard';
import { DirectionsWrapperComponent } from './directions-wrapper/directions-wrapper.component';
import { HistoryLogComponent } from './history-log/history-log.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'provider-list', component: ProviderListComponent },
  { path: 'users', component: UsersComponent },
  { path: 'admins', component: AdminsComponent, canLoad: [AdminsGuard] },
  { path: 'history-log', component: HistoryLogComponent },
  { path: 'directions', component: DirectionsWrapperComponent, canLoad: [DirectionsWrapperComponent] },
  { path: 'applications', component: AdminApplicationsComponent },
  { path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule {}

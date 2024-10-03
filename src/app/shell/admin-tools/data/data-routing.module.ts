import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminApplicationsComponent } from './admin-applications/admin-applications.component';
import { AdminsComponent } from './admins/admins.component';
import { AdminsGuard } from './admins/admins.guard';
import { DirectionsWrapperComponent } from './directions-wrapper/directions-wrapper.component';
import { DirectionsWrapperGuard } from './directions-wrapper/directions-wrapper.guard';
import { HistoryLogComponent } from './history-log/history-log.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';
import { UsersGuard } from './users/users.guard';
import { AdminWorkshopListComponent } from './admin-workshop-list/admin-workshop-list.component';

const routes: Routes = [
  { path: 'admins', component: AdminsComponent, canLoad: [AdminsGuard] },
  { path: 'directions', component: DirectionsWrapperComponent, canLoad: [DirectionsWrapperGuard] },
  { path: 'provider-list', component: ProviderListComponent },
  { path: 'workshop-list', component: AdminWorkshopListComponent },
  { path: 'users', component: UsersComponent, canLoad: [UsersGuard] },
  { path: 'applications', component: AdminApplicationsComponent },
  { path: 'history-log', component: HistoryLogComponent },
  { path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins/admins.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { UsersComponent } from './users/users.component';
import { HistoryLogComponent } from './history-log/history-log.component';
import { DirectionsComponent } from './directions-wrapper/directions/directions.component';
import { CreateDirectionComponent } from './directions-wrapper/directions/create-direction/create-direction.component';
import { DirectionsWrapperComponent } from './directions-wrapper/directions-wrapper.component';

const routes: Routes = [
  { path: 'provider-list', component: ProviderListComponent},
  { path: 'users', component: UsersComponent},
  { path: 'admins', component: AdminsComponent},
  { path: 'history-log', component: HistoryLogComponent},
  { path: 'directions', component: DirectionsWrapperComponent},
  { path: 'directions/create/:param', component: CreateDirectionComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins/admins.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { UsersComponent } from './users/users.component';
import { HistoryLogComponent } from './history-log/history-log.component';

const routes: Routes = [
  { path: 'provider-list', component: ProviderListComponent},
  { path: 'users', component: UsersComponent},
  { path: 'admins', component: AdminsComponent},
  { path: 'history-log', component: HistoryLogComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }

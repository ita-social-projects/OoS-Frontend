import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminsComponent } from './admins/admins.component';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'provider-list', component: ProviderListComponent},
  { path: 'users', component: UsersComponent},
  { path: 'admins', component: AdminsComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderListComponent } from './data/provider-list/provider-list.component';
import { PlatformComponent } from './platform/platform.component';
import { UsersComponent } from './data/users/users.component';

const routes: Routes = [
  {
    path: 'platform', component: PlatformComponent,
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
  },
  {
    path: 'data',
    loadChildren: () => import('./data/data.module').then((m) => m.DataModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminToolsRoutingModule {}

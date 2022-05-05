import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { ProviderListComponent } from './provider-list/provider-list.component';

const routes: Routes = [
  {
    path: 'platform/:index',
    component: PlatformComponent,
    loadChildren: () =>
      import('./platform/platform.module').then((m) => m.PlatformModule),
  },
  {
    path: 'provider-list',
    component: ProviderListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminToolsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data/data.component';
import { PlatformComponent } from './platform/platform.component';

const routes: Routes = [
  {
    path: 'platform', component: PlatformComponent,
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
  },
  {
    path: 'data', component: DataComponent,
    loadChildren: () => import('./data/data.module').then((m) => m.DataModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminToolsRoutingModule {}

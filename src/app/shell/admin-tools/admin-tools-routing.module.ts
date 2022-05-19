import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'platform', component: PlatformComponent,
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
  },
  {
    path: 'platform/:index', component: PlatformComponent,
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
  },
  {
    path: 'users', component: UsersComponent,
  },
  {
    path: 'users/:index', component: UsersComponent,
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminToolsRoutingModule { }

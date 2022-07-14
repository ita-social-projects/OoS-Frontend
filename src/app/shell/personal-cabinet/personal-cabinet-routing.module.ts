import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';
import { ApplicationsComponent } from './shared-cabinet/applications.component';
import { MessagesComponent } from './messages/messages.component';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';

const routes: Routes = [
  {
    path: 'config',
    component: UserConfigComponent
  },
  // {
  //   path: 'workshops',
  //   component: WorkshopsComponent,
  // },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard]
  },
  {
    path: 'parent',
    loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalCabinetRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { ChatComponent } from './shared-cabinet/messages/chat/chat.component';
import { MessagesComponent } from './shared-cabinet/messages/messages.component';
import { MessagesGuard } from './shared-cabinet/messages/messages.guard';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';
import { ProviderRoleGuard } from './provider/provider-role.guard';

const routes: Routes = [
  {
    path: 'config',
    component: UserConfigComponent
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [MessagesGuard]
  },
  {
    path: 'messages/:id',
    component: ChatComponent,
    canLoad: [MessagesGuard]
  },
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [ProviderRoleGuard]
  },
  {
    path: 'employee',
    redirectTo: 'provider'
  },
  {
    path: 'providerdeputy',
    redirectTo: 'provider'
  },
  {
    path: 'parent',
    loadChildren: () => import('./parent/parent.module').then((m) => m.ParentModule),
    canLoad: [ParentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalCabinetRoutingModule {}

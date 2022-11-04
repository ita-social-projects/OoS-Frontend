import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { MessagesComponent } from './shared-cabinet/messages/messages.component';
import { ChatComponent } from './shared-cabinet/messages/chat/chat.component';

const routes: Routes = [
  {
    path: 'config',
    component: UserConfigComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'messages/:chatRoomId',
    component: ChatComponent
  },
  {
    path: 'provider',
    loadChildren: () =>
      import('./provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [ProviderGuard]
  },
  {
    path: 'parent',
    loadChildren: () =>
      import('./parent/parent.module').then((m) => m.ParentModule),
    canLoad: [ParentGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalCabinetRoutingModule {}

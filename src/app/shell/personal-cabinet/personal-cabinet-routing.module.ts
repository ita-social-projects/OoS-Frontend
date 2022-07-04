import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfigComponent } from './user-config/user-config.component';
import { ApplicationsComponent } from './applications/applications.component';
import { MessagesComponent } from './messages/messages.component';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { WorkshopsComponent } from './workshops/workshops.component';
import { ProviderAdminsComponent } from './provider/provider-admins/provider-admins.component';

const routes: Routes = [
  {
    path: 'config',
    component: UserConfigComponent
  },
  {
    path: 'workshops',
    component: WorkshopsComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'applications',
    component: ApplicationsComponent,
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
  },
  {
    path: 'administration',
    component: ProviderAdminsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalCabinetRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { CreateWorkshopComponent } from './provider-workshops/create-workshop/create-workshop.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderMessagesComponent } from './provider-messages/provider-messages.component';

const routes: Routes = [
  { path: 'cabinet', component: PersonalCabinetComponent,
  children: [
    {
      path: 'config', 
      component: ProviderConfigComponent, 
    },
    {
      path: 'org-info', 
      component: ProviderOrgInfoComponent, 
    },
    {
      path: 'workshops', 
      component: ProviderWorkshopsComponent, 
    },
    {
      path: 'applications', 
      component: ProviderApplicationsComponent, 
    },
    {
      path: 'messages', 
      component: ProviderMessagesComponent, 
    }
  ]
 },
 {path: 'create-workshop/:id', component: CreateWorkshopComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {
}

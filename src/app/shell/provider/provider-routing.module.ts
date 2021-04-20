import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderRequestsComponent } from './provider-requests/provider-requests.component';
import { CreateWorkshopComponent } from './provider-workshops/create-workshop/create-workshop.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';

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
      path: 'requests', 
      component: ProviderRequestsComponent, 
    },
    
  ]
 },
 {path: 'create-workshop/:id', component: CreateWorkshopComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }

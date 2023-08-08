import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProviderAdminsComponent } from './provider-admins/provider-admins.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';

const routes: Routes = [
  { path: 'info', component: ProviderOrgInfoComponent },
  { path: 'administration', component: ProviderAdminsComponent },
  { path: 'workshops', component: ProviderWorkshopsComponent },
  { path: 'applications', component: ProviderApplicationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {}

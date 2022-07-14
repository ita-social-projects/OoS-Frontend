import { ProviderApplciationsComponent } from './provider-applciations/provider-applciations.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderAdminsComponent } from './provider-admins/provider-admins.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';

const routes: Routes = [
  { path: 'info', component: ProviderOrgInfoComponent },
  { path: 'administration', component: ProviderAdminsComponent },
  { path: 'workshops', component: ProviderWorkshopsComponent },
  { path: 'applications', component: ProviderApplciationsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderRoutingModule {}

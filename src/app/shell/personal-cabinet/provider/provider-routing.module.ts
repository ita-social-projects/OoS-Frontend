import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';

const routes: Routes = [
  { path: 'create-workshop/:id', component: CreateWorkshopComponent },
  { path: 'config', component: ProviderConfigComponent },
  { path: 'info', component: ProviderOrgInfoComponent }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {
}

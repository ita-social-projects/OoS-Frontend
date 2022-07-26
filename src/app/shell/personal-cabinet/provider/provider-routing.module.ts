import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';

const routes: Routes = [
  { path: 'info', component: ProviderOrgInfoComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {
}

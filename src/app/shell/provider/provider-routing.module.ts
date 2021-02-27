import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';

const routes: Routes = [
  { path: 'activities', component: ProviderActivitiesComponent },
  { path: 'config', component: ProviderConfigComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }

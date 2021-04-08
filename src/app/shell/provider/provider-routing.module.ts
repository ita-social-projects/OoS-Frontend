import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';

import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import {CanDeactivateGuard} from './provider-config/can-leave-guard.service';

const routes: Routes = [
  { path: 'cabinet', component: PersonalCabinetComponent,
  children: [
    {
      path: 'activities',
      component: ProviderActivitiesComponent,
    },
    {
      path: 'config',
      component: ProviderConfigComponent,
      canDeactivate: [CanDeactivateGuard]
    },
  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }

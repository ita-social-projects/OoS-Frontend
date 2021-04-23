import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PersonalCabinetComponent} from './personal-cabinet/personal-cabinet.component';
import {CreateActivityComponent} from './provider-activities/create-activity/create-activity.component';

import {ProviderConfigComponent} from './provider-config/provider-config.component';
// import {ProviderRequestsComponent} from './provider-requests/provider-requests.component';
import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';

const routes: Routes = [
  {
    path: 'cabinet', component: PersonalCabinetComponent,
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
        path: 'activities',
        component: ProviderActivitiesComponent,
      },
      // {
      //   path: 'requests',
      //   component: ProviderRequestsComponent,
      // },
      {
        path: 'messages'
      },

    ]
  },
  { path: 'create-activity/:id', component: CreateActivityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {
}


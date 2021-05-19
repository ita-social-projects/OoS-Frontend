import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './result/result.component';
import { ParentGuard } from './personal-cabinet/parent/parent.guard';
import { Routes, RouterModule } from '@angular/router';
import { GroupComponent } from './section/group/group.component';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { WorkshopsComponent } from './personal-cabinet/workshops/workshops.component';
import { MessagesComponent } from './personal-cabinet/messages/messages.component';
import { ApplicationsComponent } from './personal-cabinet/applications/applications.component';
import { CreateApplicationComponent } from './section/group/create-application/create-application.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', component: ResultComponent },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    children: [
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
        loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
        canLoad: [ProviderGuard]
      },
      {
        path: 'parent',
        loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
        canLoad: [ParentGuard]
      }
    ]
  },
  {
    path: 'section/group', component: GroupComponent
  },
  {
    path: 'create-application', component: CreateApplicationComponent
  },
  {
    path: 'workshop-details', component: WorkshopDetailsComponent,
    loadChildren: () => import('./workshop-details/workshop-details.module').then(m => m.WorkshopDetailsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

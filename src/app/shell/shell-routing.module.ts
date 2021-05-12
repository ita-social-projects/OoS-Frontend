import {NgModule} from '@angular/core';
import {MainComponent} from './main/main.component';
import {ResultComponent} from './result/result.component';
import {ParentGuard} from './personal-cabinet/parent/parent.guard';
import {Routes, RouterModule} from '@angular/router';
import {GroupComponent} from './section/group/group.component';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { WorkshopsComponent } from './personal-cabinet/workshops/workshops.component';
import { MessagesComponent } from './personal-cabinet/messages/messages.component';
import { ApplicationsComponent } from './personal-cabinet/applications/applications.component';



const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'result', component: ResultComponent},
  { path: 'personal-cabinet',component: PersonalCabinetComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

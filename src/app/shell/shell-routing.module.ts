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

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', component: ResultComponent },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then(m => m.PersonalCabinetModule),
  },
  { path: 'section/group', component: GroupComponent },
  { path: 'create-application', component: CreateApplicationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

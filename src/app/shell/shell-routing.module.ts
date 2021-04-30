import {NgModule} from '@angular/core';
import {MainComponent} from './main/main.component';
import {ResultComponent} from './result/result.component';

import {ParentGuard} from './personal-cabinet/parent/parent.guard';
import {Routes, RouterModule} from '@angular/router';
import {GroupComponent} from './section/group/group.component';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'result', component: ResultComponent},
  {
    path: 'provider',
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard]
  },
  {
    path: 'parent',
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard]
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

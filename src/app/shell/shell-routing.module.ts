import {NgModule} from '@angular/core';
import {MainComponent} from './main/main.component';
import {ResultComponent} from './result/result.component';
import {ProviderGuard} from './provider/provider.guard';
import {ParentGuard} from './parent/parent.guard';
import {Routes, RouterModule} from '@angular/router';
import {GroupComponent} from './section/group/group.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'result', component: ResultComponent},
  {
    path: 'provider',
    loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard]
  },
  {
    path: 'parent',
    loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard]
  },
  {
    path: 'section/group/:id', component: GroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

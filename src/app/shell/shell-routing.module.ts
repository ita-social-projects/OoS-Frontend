import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from './main/main.component';
import {ResultComponent} from './main/result/result.component';
import {ProviderGuard} from './provider/provider.guard';
import {ParentGuard} from './parent/parent.guard';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {
}

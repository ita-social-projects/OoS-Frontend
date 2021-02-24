import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './main/result/result.component';
import { ProviderGuard } from './provider/provider.guard';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', component: ResultComponent },
  { path: 'provider', loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule), canActivate: [ProviderGuard] },
  { path: 'parent', loadChildren: () => import('./parent/parent.module').then(m => m.ParentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

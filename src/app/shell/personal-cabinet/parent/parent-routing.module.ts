import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';

const routes: Routes = [
  { path: 'config', component: ParentConfigComponent },
  { path: 'info', component: ParentInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';

const routes: Routes = [
  { path: 'config', component: ParentConfigComponent },
  { path: 'info', component: ParentInfoComponent},
  { path: 'info/create-child', component: ParentCreateChildComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

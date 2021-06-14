import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentInfoComponent } from './parent-info/parent-info.component';

const routes: Routes = [
  { path: 'info', component: ParentInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

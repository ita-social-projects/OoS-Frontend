import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateApplicationComponent } from '../../workshop-details/create-application/create-application.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';

const routes: Routes = [
  { path: 'info', component: ParentInfoComponent },
  { path: 'create-application', component: CreateApplicationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

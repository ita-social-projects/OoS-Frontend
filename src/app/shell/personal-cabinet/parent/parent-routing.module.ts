import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateApplicationComponent } from '../../workshop-details/create-application/create-application.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';

const routes: Routes = [
  { path: 'config', component: ParentConfigComponent },
  { path: 'info', component: ParentCreateChildComponent },
  { path: 'info/create-child', component: ParentCreateChildComponent },
  { path: 'create-application', component: CreateApplicationComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

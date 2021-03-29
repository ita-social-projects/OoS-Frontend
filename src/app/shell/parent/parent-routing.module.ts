import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';

import { AddChildComponent } from './parent-config/add-child/add-child/add-child.component';
const routes: Routes = [
  { path: 'activities', component: ParentActivitiesComponent },
  { path: 'config', component: ParentConfigComponent },
  { path: 'add-child', component: AddChildComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

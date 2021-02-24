import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';

const routes: Routes = [
  { path: 'activities', component: ParentActivitiesComponent },
  { path: 'config', component: ParentConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

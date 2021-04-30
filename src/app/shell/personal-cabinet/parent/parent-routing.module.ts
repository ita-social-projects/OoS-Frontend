import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ParentAddChildComponent } from './parent-create-child/parent-create-child.component';
import { ParentWorkshopsComponent } from './parent-workshops/parent-workshops.component';
const routes: Routes = [
  { path: 'workshops', component: ParentWorkshopsComponent },
  { path: 'config', component: ParentConfigComponent },
  { path: 'add-child', component: ParentAddChildComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

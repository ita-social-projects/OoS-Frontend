import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteWorkshopsComponent } from './favorite-workshops/favorite-workshops.component';
import { ChildrenComponent } from './children/children.component';
import { ParentWorkshopsComponent } from './parent-workshops/parent-workshops.component';
import { ParentApplicationsComponent } from './parent-applications/parent-applications.component';

const routes: Routes = [
  { path: 'info', component: ChildrenComponent },
  { path: 'favorite', component: FavoriteWorkshopsComponent },
  { path: 'workshops', component: ParentWorkshopsComponent },
  { path: 'applications', component: ParentApplicationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentRoutingModule {}

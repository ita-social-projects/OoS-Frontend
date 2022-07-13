import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteWorkshopsComponent } from './favorite-workshops/favorite-workshops.component';
import { ChildrenComponent } from './children/children.component';
import { ParentWorkshopsComponent } from './parent-workshops/parent-workshops.component';

const routes: Routes = [
  { path: 'info', component: ChildrenComponent },
  { path: 'favorite', component: FavoriteWorkshopsComponent },
  { path: 'workshops', component: ParentWorkshopsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteWorkshopsComponent } from './favorite-workshops/favorite-workshops.component';
import { ChildrenComponent } from './children/children.component';

const routes: Routes = [
  { path: 'info', component: ChildrenComponent },
  { path: 'favorite', component: FavoriteWorkshopsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }

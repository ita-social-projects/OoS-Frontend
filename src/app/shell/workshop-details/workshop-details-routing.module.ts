import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderAboutComponent } from './workshop-page/provider-about/provider-about.component';
import { ReviewsComponent } from './workshop-page/reviews/reviews.component';
import { WorkshopAboutComponent } from './workshop-page/workshop-about/workshop-about.component';
import { WorkshopTeachersComponent } from './workshop-page/workshop-teachers/workshop-teachers.component';

const routes: Routes = [
  { path: 'workshop-about', component: WorkshopAboutComponent },
  { path: 'provider-about', component: ProviderAboutComponent },
  { path: 'workshop-teachers', component: WorkshopTeachersComponent },
  { path: 'reviews', component: ReviewsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class WorkshopDetailsRoutingModule { }

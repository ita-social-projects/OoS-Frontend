import { DirectionsComponent } from './create-direction/directions/directions.component';
import { SupportPlatformComponent } from './support-platform/support-platform.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPlatformComponent } from './about-platform/about-platform.component';

const routes: Routes = [
  { path: 'about-platform', component: AboutPlatformComponent },
  { path: 'support-platform', component: SupportPlatformComponent },
  { path: 'directions', component: DirectionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }

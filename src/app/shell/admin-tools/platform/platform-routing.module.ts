import { DirectionsComponent } from './create-direction/directions/directions.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformInfoComponent } from './platform-info/platform-info.component';

const routes: Routes = [
  { path: 'directions', component: DirectionsComponent },
  { path: 'platform-info:param', component: PlatformInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }

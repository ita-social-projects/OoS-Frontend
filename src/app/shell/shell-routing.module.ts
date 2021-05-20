import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './result/result.component';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', component: ResultComponent },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then(m => m.PersonalCabinetModule),
    canLoad: [PersonalCabinetGuard]

  },
  {
    path: 'workshop-details', component: WorkshopDetailsComponent,
    loadChildren: () => import('./workshop-details/workshop-details.module').then(m => m.WorkshopDetailsModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

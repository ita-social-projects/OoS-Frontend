import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './result/result.component';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { CreateWorkshopComponent } from './personal-cabinet/provider/create-workshop/create-workshop.component';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { CreateProviderComponent } from './personal-cabinet/provider/create-provider/create-provider.component';
import { ParentGuard } from './personal-cabinet/parent/parent.guard';
import { CreateChildComponent } from './personal-cabinet/parent/create-child/create-child.component';
import { CreateApplicationComponent } from './personal-cabinet/parent/create-application/create-application.component';
import { CreateProviderGuard } from './personal-cabinet/provider/create-provider/create-provider.guard';
import { UserConfigEditComponent } from './personal-cabinet/user-config/user-config-edit/user-config-edit.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', component: ResultComponent },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then(m => m.PersonalCabinetModule),
    canLoad: [PersonalCabinetGuard]
  },
  {
    path: 'personal-cabinet/config/edit',
    component: UserConfigEditComponent
  },
  {
    path: 'workshop-details/:id', component: WorkshopDetailsComponent,
    loadChildren: () => import('./workshop-details/workshop-details.module').then(m => m.WorkshopDetailsModule),
  },
  {
    path: 'create-workshop', component: CreateWorkshopComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard]
  },
  {
    path: 'create-provider', component: CreateProviderComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [CreateProviderGuard]
  },
  {
    path: 'create-child', component: CreateChildComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard]
  },
  {
    path: 'create-application', component: CreateApplicationComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

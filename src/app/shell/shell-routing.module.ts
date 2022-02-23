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
import { CreateGuard } from './personal-cabinet/create.guard';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AboutComponent } from './info/about/about.component';
import { SupportComponent } from './info/support/support.component';
import { InfoComponent } from './info/info.component';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
import { AdminToolsGuard } from './admin-tools/admin-tools.guard';
import { AboutEditComponent } from './admin-tools/platform/about-edit/about-edit.component';
import { SupportEditComponent } from './admin-tools/platform/support-edit/support-edit.component';
import { CreateDirectionComponent } from './admin-tools/platform/create-direction/create-direction.component';
import { CreateProviderAdminComponent } from './personal-cabinet/provider/create-provider-admin/create-provider-admin.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', redirectTo: 'result/list', pathMatch: 'full' },
  { path: 'result/:param', component: ResultComponent },
  { path: 'all-categories', component: AllCategoriesComponent },
  {
    path: 'info', component: InfoComponent, children: [
      { path: 'about', component: AboutComponent },
      { path: 'support', component: SupportComponent },
    ]
  },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then(m => m.PersonalCabinetModule),
    canLoad: [PersonalCabinetGuard]
  },
  {
    path: 'admin-tools', component: AdminToolsComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule),
    canLoad: [AdminToolsGuard]
  },
  {
    path: 'personal-cabinet/config/edit',
    component: UserConfigEditComponent
  },
  {
    path: 'admin-tools/platform/about/edit',
    component: AboutEditComponent
  },
  {
    path: 'admin-tools/platform/support/edit',
    component: SupportEditComponent
  },
  {
    path: 'admin-tools/platform/directions/create',
    component: CreateDirectionComponent
  },
  {
    path: 'workshop-details/:id', component: WorkshopDetailsComponent,
    loadChildren: () => import('./workshop-details/workshop-details.module').then(m => m.WorkshopDetailsModule),
  },
  {
    path: 'create-workshop/:param', component: CreateWorkshopComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-workshop', component: CreateWorkshopComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-provider/:param', component: CreateProviderComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [CreateProviderGuard],
    canDeactivate: [CreateProviderGuard, CreateGuard]
  },
  {
    path: 'create-provider-admin/:param', component: CreateProviderAdminComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-child/:param', component: CreateChildComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-application/:id', component: CreateApplicationComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then(m => m.ParentModule),
    canLoad: [ParentGuard],
    canDeactivate: [CreateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }

import { LoginComponent } from './../shared/components/login/login.component';
import { InfoEditComponent } from './admin-tools/platform/platform-info/info-edit/info-edit.component';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './result/result.component';
import { Routes, RouterModule } from '@angular/router';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
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
import { CreateDirectionComponent } from './admin-tools/platform/directions/create-direction/create-direction.component';
import { CreateProviderAdminComponent } from './personal-cabinet/provider/create-provider-admin/create-provider-admin.component';
import { NotificationsListComponent } from '../shared/components/notifications/notifications-list/notifications-list.component';
import { IsMobileGuard } from './is-mobile.guard';
import { RulesComponent } from './info/rules/rules.component';
import { DetailsComponent } from './details/details.component';
import { CreateAchievementComponent } from './personal-cabinet/provider/create-achievement/create-achievement.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', redirectTo: 'result/list', pathMatch: 'full' },
  { path: 'result/:param', component: ResultComponent },
  { path: 'all-categories', component: AllCategoriesComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'info', component: InfoComponent, children: [
      { path: 'about', component: AboutComponent },
      { path: 'support', component: SupportComponent },
      { path: 'rules', component: RulesComponent },
    ]
  },
  {
    path: 'personal-cabinet', component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then(m => m.PersonalCabinetModule),
    canLoad: [PersonalCabinetGuard],
    canActivate: [PersonalCabinetGuard]
  },
  {
    path: 'admin-tools', component: AdminToolsComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule),
    canLoad: [AdminToolsGuard]
  },
  {
    path: 'personal-cabinet/config/edit',
    component: UserConfigEditComponent,
    canDeactivate: [CreateGuard]
  },
  {
    path: 'admin-tools/platform/update/:param/:mode', component: InfoEditComponent,
    loadChildren: () => import('./admin-tools/platform/platform.module').then(m => m.PlatformModule),
    canDeactivate: [CreateGuard]
  },
  {
    path: 'admin-tools/platform/directions/create/:param',
    component: CreateDirectionComponent
  },
  {
  path: 'admin-tools/platform/directions/create',
  component: CreateDirectionComponent
  },
  {
    path: 'notifications',
    component: NotificationsListComponent,
    canLoad: [PersonalCabinetGuard, IsMobileGuard],
    canActivate: [IsMobileGuard]
  },
  {
    path: 'details/workshop/:id', component: DetailsComponent,
    loadChildren: () => import('./details/details.module').then(m => m.DetailsModule),
  },
  {
    path: 'details/provider/:id', component: DetailsComponent,
    loadChildren: () => import('./details/details.module').then(m => m.DetailsModule),
  },
  {
    path: 'create-workshop/:param', component: CreateWorkshopComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then(m => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-achievement/:param', component: CreateAchievementComponent,
  },
  {
  path: 'admin-tools/platform/create/:param', component: CreateDirectionComponent,
  loadChildren: () => import('./admin-tools/platform/platform.module').then(m => m.PlatformModule),
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

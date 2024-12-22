import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from 'shared/components/error-page/error-page.component';
import { LoginComponent } from 'shared/components/login/login.component';
import { NotificationsListComponent } from 'shared/components/notifications/notifications-list/notifications-list.component';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
import { AdminToolsGuard } from './admin-tools/admin-tools.guard';
import { CreateAdminComponent } from './admin-tools/data/admins/create-admin/create-admin.component';
import { CreateAdminGuard } from './admin-tools/data/admins/create-admin/create-admin.guard';
import { CreateDirectionComponent } from './admin-tools/data/directions-wrapper/directions/create-direction/create-direction.component';
import { InfoEditComponent } from './admin-tools/platform/platform-info/info-edit/info-edit.component';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { DetailsComponent } from './details/details.component';
import { AboutComponent } from './info/about/about.component';
import { InfoComponent } from './info/info.component';
import { RulesComponent } from './info/rules/rules.component';
import { SupportComponent } from './info/support/support.component';
import { IsMobileGuard } from './is-mobile.guard';
import { MainComponent } from './main/main.component';
import { CreateApplicationComponent } from './personal-cabinet/parent/create-application/create-application.component';
import { CreateChildComponent } from './personal-cabinet/parent/create-child/create-child.component';
import { ParentGuard } from './personal-cabinet/parent/parent.guard';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
import { CreateAchievementComponent } from './personal-cabinet/provider/create-achievement/create-achievement.component';
import { CreateEmployeeComponent } from './personal-cabinet/provider/create-employee/create-employee.component';
import { CreateProviderComponent } from './personal-cabinet/provider/create-provider/create-provider.component';
import { CreateProviderGuard } from './personal-cabinet/provider/create-provider/create-provider.guard';
import { CreateWorkshopComponent } from './personal-cabinet/provider/create-workshop/create-workshop.component';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { CreateGuard } from './personal-cabinet/shared-cabinet/create-form/create.guard';
import { UserConfigEditComponent } from './personal-cabinet/shared-cabinet/user-config/user-config-edit/user-config-edit.component';
import { ResultComponent } from './result/result.component';
import { CreateParentComponent } from './personal-cabinet/parent/create-parent/create-parent.component';
import { CreateParentGuard } from './personal-cabinet/parent/create-parent/create-parent.guard';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'result', redirectTo: 'result/List', pathMatch: 'full' },
  { path: 'result/:param', component: ResultComponent },
  { path: 'all-categories', component: AllCategoriesComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'info',
    component: InfoComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'support', component: SupportComponent },
      { path: 'rules', component: RulesComponent }
    ]
  },
  {
    path: 'personal-cabinet',
    component: PersonalCabinetComponent,
    loadChildren: () => import('./personal-cabinet/personal-cabinet.module').then((m) => m.PersonalCabinetModule),
    canLoad: [PersonalCabinetGuard]
  },
  {
    path: 'admin-tools',
    component: AdminToolsComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then((m) => m.AdminToolsModule),
    canLoad: [AdminToolsGuard]
  },
  {
    path: 'personal-cabinet/config/edit',
    component: UserConfigEditComponent,
    canDeactivate: [CreateGuard]
  },
  {
    path: 'admin-tools/platform/update/:param/:mode',
    component: InfoEditComponent,
    loadChildren: () => import('./admin-tools/platform/platform.module').then((m) => m.PlatformModule),
    canDeactivate: [CreateGuard]
  },
  {
    path: 'notifications',
    component: NotificationsListComponent,
    canLoad: [PersonalCabinetGuard, IsMobileGuard],
    canActivate: [IsMobileGuard]
  },
  {
    path: 'details/:entity/:id',
    component: DetailsComponent,
    loadChildren: () => import('./details/details.module').then((m) => m.DetailsModule)
  },
  {
    path: 'create-workshop/:param',
    component: CreateWorkshopComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-achievement/:param',
    component: CreateAchievementComponent,
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'admin-tools/data/directions/create/:param',
    component: CreateDirectionComponent,
    loadChildren: () => import('./admin-tools/data/data.module').then((m) => m.DataModule)
  },
  {
    path: 'create-provider/:param',
    component: CreateProviderComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [CreateProviderGuard],
    canDeactivate: [CreateProviderGuard, CreateGuard]
  },
  {
    path: 'create-employee/:param',
    component: CreateEmployeeComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'update-employee/:param/:id',
    component: CreateEmployeeComponent,
    loadChildren: () => import('./personal-cabinet/provider/provider.module').then((m) => m.ProviderModule),
    canLoad: [ProviderGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-admin/:param',
    component: CreateAdminComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then((m) => m.AdminToolsModule),
    canActivate: [CreateAdminGuard],
    canLoad: [AdminToolsGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'update-admin/:param/:id',
    component: CreateAdminComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then((m) => m.AdminToolsModule),
    canActivate: [CreateAdminGuard],
    canLoad: [AdminToolsGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'directions/create/:param',
    component: CreateDirectionComponent,
    loadChildren: () => import('./admin-tools/admin-tools.module').then((m) => m.AdminToolsModule),
    canActivate: [AdminToolsGuard],
    canLoad: [AdminToolsGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-child/:param',
    component: CreateChildComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then((m) => m.ParentModule),
    canLoad: [ParentGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-application/:id',
    component: CreateApplicationComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then((m) => m.ParentModule),
    canLoad: [ParentGuard],
    canDeactivate: [CreateGuard]
  },
  {
    path: 'create-parent/:param',
    component: CreateParentComponent,
    loadChildren: () => import('./personal-cabinet/parent/parent.module').then((m) => m.ParentModule),
    canDeactivate: [CreateGuard],
    canLoad: [CreateParentGuard]
  },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}

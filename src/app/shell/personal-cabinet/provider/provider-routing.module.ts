import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProviderAdminsComponent } from './provider-admins/provider-admins.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { NotProviderAdminGuard } from './not-provider-admin.guard';
import { ProviderEmployeesUploadComponent } from './provider-employees-upload/provider-employees-upload.component';

const routes: Routes = [
  { path: 'info', component: ProviderOrgInfoComponent },
  { path: 'administration', component: ProviderAdminsComponent, canActivate: [NotProviderAdminGuard] },
  { path: 'workshops', component: ProviderWorkshopsComponent },
  { path: 'applications', component: ProviderApplicationsComponent },
  { path: 'upload-employees', component: ProviderEmployeesUploadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NotProviderAdminGuard]
})
export class ProviderRoutingModule {}

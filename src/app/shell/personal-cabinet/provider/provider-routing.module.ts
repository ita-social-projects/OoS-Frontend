import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeesComponent } from './employees/employees.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { NotEmployeeGuard } from './not-employee.guard';
import { ProviderPositionsComponent } from './provider-positions/provider-positions.component';
import { ProviderEmployeesComponent } from './provider-employees/provider-employees.component';

const routes: Routes = [
  { path: 'info', component: ProviderOrgInfoComponent },
  { path: 'administration', component: EmployeesComponent, canActivate: [NotEmployeeGuard] },
  { path: 'workshops', component: ProviderWorkshopsComponent },
  { path: 'applications', component: ProviderApplicationsComponent },
  { path: 'provider-employees', component: ProviderEmployeesComponent },
  { path: 'positions', component: ProviderPositionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NotEmployeeGuard]
})
export class ProviderRoutingModule {}

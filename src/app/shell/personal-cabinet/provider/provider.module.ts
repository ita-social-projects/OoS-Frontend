import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'shared/modules/material.module';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { SharedModule } from 'shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MOMENT_DATE_FORMATS } from 'shared/constants/constants';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SharedCabinetModule } from '../shared-cabinet/shared-cabinet.module';
import { CreateAchievementComponent } from './create-achievement/create-achievement.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { CreateContactsFormComponent } from './create-provider/create-contacts-form/create-contacts-form.component';
import { CreateInfoFormComponent } from './create-provider/create-info-form/create-info-form.component';
import { CreatePhotoFormComponent } from './create-provider/create-photo-form/create-photo-form.component';
import { CreateProviderComponent } from './create-provider/create-provider.component';
import { CreateAboutFormComponent } from './create-workshop/create-about-form/create-about-form.component';
// eslint-disable-next-line max-len
import { WorkingHoursFormWrapperComponent } from './create-workshop/create-about-form/working-hours-form-wrapper/working-hours-form-wrapper.component';
import { CreateDescriptionFormComponent } from './create-workshop/create-description-form/create-description-form.component';
import { CreateTeacherComponent } from './create-workshop/create-teacher/create-teacher.component';
import { TeacherFormComponent } from './create-workshop/create-teacher/teacher-form/teacher-form.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { ProviderEmployeesUploadComponent } from './provider-employees-upload/provider-employees-upload.component';
import { ProviderStudySubjectsComponent } from './provider-study-subjects/provider-study-subjects.component';
import { CreateStudySubjectComponent } from './create-study-subject/create-study-subject.component';
import { CreateAdditionalAboutFormComponent } from './create-workshop/create-additional-about-form/create-additional-about-form.component';
import { ProviderPositionsComponent } from './provider-positions/provider-positions.component';
import { CreatePositionComponent } from './create-position/create-position.component';
import { CreatePositionFormComponent } from './create-position/position-form/create-position-form.component';
import { ProviderEmployeesComponent } from './provider-employees/provider-employees.component';
import { CreateCompetitionComponent } from './create-competition/create-competition.component';
import { CreateRequiredFormComponent } from './create-competition/create-required-form/create-required-form.component';
import { CreateCompetitionDescriptionFormComponent } from './create-competition/create-competition-description-form/create-competition-description-form.component';
import { CreateJudgeComponent } from './create-competition/create-judge/create-judge.component';
import { JudgeFormComponent } from './create-competition/create-judge/judge-form/judge-form.component';
import { ProviderCompetitionComponent } from './provider-competition/provider-competition.component';
import { ProviderDraftsComponent } from './provider-drafts/provider-drafts.component';
import { WorkshopDraftsComponent } from './provider-drafts/workshop-drafts/workshop-drafts.component';
import { CompetitionDraftsComponent } from './provider-drafts/competition-drafts/competition-drafts.component';

@NgModule({
  declarations: [
    ProviderOrgInfoComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    CreateWorkshopComponent,
    CreateProviderComponent,
    CreateInfoFormComponent,
    CreateContactsFormComponent,
    CreatePhotoFormComponent,
    CreateTeacherComponent,
    TeacherFormComponent,
    CreateEmployeeComponent,
    CreateAchievementComponent,
    EmployeesComponent,
    ProviderApplicationsComponent,
    ProviderWorkshopsComponent,
    ProviderDraftsComponent,
    WorkshopDraftsComponent,
    CompetitionDraftsComponent,
    WorkingHoursFormWrapperComponent,
    ProviderEmployeesUploadComponent,
    ProviderStudySubjectsComponent,
    CreateStudySubjectComponent,
    CreateCompetitionComponent,
    CreateRequiredFormComponent,
    CreateAdditionalAboutFormComponent,
    ProviderPositionsComponent,
    CreatePositionComponent,
    CreatePositionFormComponent,
    ProviderEmployeesComponent,
    CreateCompetitionDescriptionFormComponent,
    CreateJudgeComponent,
    JudgeFormComponent,
    ProviderCompetitionComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    SharedModule,
    MaterialModule,
    SharedCabinetModule,
    RouterModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    DatePipe,
    GeolocationService,
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, strict: true } }
  ]
})
export class ProviderModule {}

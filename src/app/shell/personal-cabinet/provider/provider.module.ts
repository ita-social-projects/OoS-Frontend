import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'shared/modules/material.module';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { SharedModule } from 'shared/shared.module';
import { SharedCabinetModule } from '../shared-cabinet/shared-cabinet.module';
import { CreateAchievementComponent } from './create-achievement/create-achievement.component';
import { CreateAddressFormComponent } from './create-address-form/create-address-form.component';
import { CreateProviderAdminComponent } from './create-provider-admin/create-provider-admin.component';
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
import { CreateWorkshopAddressComponent } from './create-workshop/create-workshop-address/create-workshop-address.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { ProviderAdminsComponent } from './provider-admins/provider-admins.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';

@NgModule({
  declarations: [
    ProviderOrgInfoComponent,
    CreateWorkshopAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    CreateWorkshopComponent,
    CreateProviderComponent,
    CreateInfoFormComponent,
    CreateContactsFormComponent,
    CreatePhotoFormComponent,
    CreateTeacherComponent,
    TeacherFormComponent,
    CreateProviderAdminComponent,
    CreateAchievementComponent,
    ProviderAdminsComponent,
    ProviderApplicationsComponent,
    ProviderWorkshopsComponent,
    WorkingHoursFormWrapperComponent,
    CreateAddressFormComponent
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

  providers: [DatePipe, GeolocationService]
})
export class ProviderModule {}

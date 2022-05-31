import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { InformationPageComponent } from './information-page/information-page.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { DetailsComponent } from './details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { WorkshopAboutComponent } from './information-page/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './information-page/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './information-page/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './information-page/reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { ScheduleComponent } from './side-menu/schedule/schedule.component';
import { AllProviderWorkshopsComponent } from './information-page/all-provider-workshops/all-provider-workshops.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DetailsComponent,
    InformationPageComponent,
    SideMenuComponent,
    WorkshopAboutComponent,
    ProviderAboutComponent,
    WorkshopTeachersComponent,
    ReviewsComponent,
    ActionsComponent,
    ContactsComponent,
    ScheduleComponent,
    AllProviderWorkshopsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DetailsModule { }

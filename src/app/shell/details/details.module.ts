import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DetailsPageComponent } from './details-page/details-page.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { DetailsComponent } from './details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { WorkshopAboutComponent } from './details-page/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './details-page/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './details-page/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './details-page/reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { ScheduleComponent } from './side-menu/schedule/schedule.component';
import { AllProviderWorkshopsComponent } from './details-page/all-provider-workshops/all-provider-workshops.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DetailsComponent,
    DetailsPageComponent,
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

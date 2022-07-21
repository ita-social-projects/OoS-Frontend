import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { DetailsComponent } from './details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { WorkshopAboutComponent } from './details-tabs/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './details-tabs/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './details-tabs/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './details-tabs/reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { AllProviderWorkshopsComponent } from './details-tabs/all-provider-workshops/all-provider-workshops.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { TeacherCardComponent } from './details-tabs/workshop-teachers/teacher-card/teacher-card.component';
import { StarsComponent } from './details-tabs/reviews/stars/stars.component';

@NgModule({
  declarations: [
    DetailsComponent,
    SideMenuComponent,
    WorkshopAboutComponent,
    ProviderAboutComponent,
    WorkshopTeachersComponent,
    ReviewsComponent,
    ActionsComponent,
    ContactsComponent,
    AllProviderWorkshopsComponent,
    WorkshopDetailsComponent,
    ProviderDetailsComponent,
    AchievementsComponent,
    TeacherCardComponent,
    StarsComponent
  ],
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

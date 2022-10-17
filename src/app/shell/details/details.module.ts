import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { DetailsComponent } from './details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { WorkshopAboutComponent } from './details-tabs/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './details-tabs/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './details-tabs/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './details-tabs/reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { AllProviderWorkshopsComponent } from './details-tabs/all-provider-workshops/all-provider-workshops.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { AchievementsComponent } from './details-tabs/achievements/achievements.component';
import { TeacherCardComponent } from './details-tabs/workshop-teachers/teacher-card/teacher-card.component';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'AboutWorkshopl', component: WorkshopAboutComponent,
  },
  {
    path: 'AboutProvider', component: ProviderAboutComponent,
  },
  {
    path: 'Teachers', component: WorkshopTeachersComponent,
  },
  {
    path: 'OtherWorkshops', component: AllProviderWorkshopsComponent,
  },
  {
    path: 'Reviews', component: ReviewsComponent,
  },
  {
    path: 'Achievements', component: AchievementsComponent,
  },
];

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
    TeacherCardComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DetailsModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { SharedModule } from '../../shared/shared.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { DetailsComponent } from './details.component';
import { WorkshopAboutComponent } from './details-tabs/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './details-tabs/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './details-tabs/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './details-tabs/reviews/reviews.component';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { AllProviderWorkshopsComponent } from './details-tabs/all-provider-workshops/all-provider-workshops.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { ProviderDetailsComponent } from './provider-details/provider-details.component';
import { AchievementsComponent } from './details-tabs/achievements/achievements.component';
import { TeacherCardComponent } from './details-tabs/workshop-teachers/teacher-card/teacher-card.component';

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
  imports: [CommonModule, SharedModule, MaterialModule, TranslateModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class DetailsModule {}

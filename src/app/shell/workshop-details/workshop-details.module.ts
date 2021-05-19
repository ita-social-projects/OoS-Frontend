import { NgModule } from '@angular/core';
import { WorkshopPageComponent } from './workshop-page/workshop-page.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { WorkshopDetailsComponent } from './workshop-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { RouterModule } from '@angular/router';
import { WorkshopAboutComponent } from './workshop-page/workshop-about/workshop-about.component';
import { ProviderAboutComponent } from './workshop-page/provider-about/provider-about.component';
import { WorkshopTeachersComponent } from './workshop-page/workshop-teachers/workshop-teachers.component';
import { ReviewsComponent } from './workshop-page/reviews/reviews.component';
import { WorkshopDetailsRoutingModule } from './workshop-details-routing.module';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './side-menu/actions/actions.component';
import { ContactsComponent } from './side-menu/contacts/contacts.component';
import { ScheduleComponent } from './side-menu/schedule/schedule.component';

@NgModule({
  declarations: [
    WorkshopDetailsComponent,
    WorkshopPageComponent,
    SideMenuComponent,
    WorkshopAboutComponent,
    ProviderAboutComponent,
    WorkshopTeachersComponent,
    ReviewsComponent,
    ActionsComponent,
    ContactsComponent,
    ScheduleComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    WorkshopDetailsRoutingModule
  ],
  providers: [
  ]
})
export class WorkshopDetailsModule { }

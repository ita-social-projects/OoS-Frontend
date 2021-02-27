import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ChildCardComponent } from './parent-config/child-card/child-card.component';

@NgModule({
  declarations: [
    ParentActivitiesComponent, 
    ParentConfigComponent, ChildCardComponent],
  imports: [
    CommonModule,
    ParentRoutingModule
  ]
})
export class ParentModule { }

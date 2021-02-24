import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';


@NgModule({
  declarations: [ParentActivitiesComponent, ParentConfigComponent],
  imports: [
    CommonModule,
    ParentRoutingModule
  ]
})
export class ParentModule { }

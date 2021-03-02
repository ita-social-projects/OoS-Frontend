import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ChildActivitiesComponent } from './parent-activities/child-activities/child-activities.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ParentActivitiesComponent, 
    ParentConfigComponent, 
    ChildActivitiesComponent
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    FlexLayoutModule,
    MatButtonModule
  ]
})
export class ParentModule { }

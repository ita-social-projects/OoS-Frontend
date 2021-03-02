import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ChildCardComponent } from './parent-config/child-card/child-card.component';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    ParentActivitiesComponent, 
    ParentConfigComponent, 
    ChildCardComponent
  ],

  imports: [
    CommonModule,
    ParentRoutingModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatRadioModule,
    MatDatepickerModule
    
    
  ]
})
export class ParentModule { }

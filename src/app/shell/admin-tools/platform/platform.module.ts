import { PlatformComponent } from './platform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CreateDirectionComponent } from './create-direction/create-direction.component';
import { AddClassFormComponent } from './create-direction/add-class-form/add-class-form.component';
import { AddDepartmentFormComponent } from './create-direction/add-department-form/add-department-form.component';
import { AddDirectionFormComponent } from './create-direction/add-direction-form/add-direction-form.component';
import { InfoFormComponent } from './platform-info/info-edit/info-form/info-form.component';
import { DirectionsComponent } from './create-direction/directions/directions.component';
import { AboutInfoComponent } from './platform-info/about-info.component';
import { InfoCardComponent } from './platform-info/info-card/info-card.component';
import { InfoEditComponent } from './platform-info/info-edit/info-edit.component';
import { SupportInfoComponent } from './platform-info/support-info.component';
import { RegulationsInfoComponent } from './platform-info/regulations-info.component';

@NgModule({
  declarations: [
    InfoFormComponent,
    CreateDirectionComponent,
    AddClassFormComponent,
    AddDepartmentFormComponent,
    AddDirectionFormComponent,
    DirectionsComponent,
    InfoCardComponent,
    AboutInfoComponent,
    RegulationsInfoComponent,
    SupportInfoComponent,
    InfoEditComponent,
    PlatformComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [ 
    PlatformComponent
  ]
})
export class PlatformModule { }

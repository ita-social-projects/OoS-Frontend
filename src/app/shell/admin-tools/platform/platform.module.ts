import { PlatformComponent } from './platform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CreateDirectionComponent } from './directions/create-direction/create-direction.component';
import { AddClassFormComponent } from './directions/create-direction/add-class-form/add-class-form.component';
import { AddDepartmentFormComponent } from './directions/create-direction/add-department-form/add-department-form.component';
import { AddDirectionFormComponent } from './directions/create-direction/add-direction-form/add-direction-form.component';
import { NewClassFormComponent } from './directions/create-direction/add-class-form/new-class-form/new-class-form.component';
import { ClassesCheckBoxListComponent } from './directions/create-direction/add-class-form/classes-check-box-list/classes-check-box-list.component';
import { DirectionsComponent } from './directions/directions.component';
import { InfoCardComponent } from './platform-info/info-card/info-card.component';
import { RegulationsInfoComponent } from './platform-info/regulations-info.component';
import { SupportInfoComponent } from './platform-info/support-info.component';
import { AboutInfoComponent } from './platform-info/about-info.component';
import { InfoEditComponent } from './platform-info/info-edit/info-edit.component';
import { MainPageInfoComponent } from './main-page-info/main-page-info.component';

@NgModule({
  declarations: [
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
    PlatformComponent,
    ClassesCheckBoxListComponent,
    NewClassFormComponent,
    MainPageInfoComponent
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

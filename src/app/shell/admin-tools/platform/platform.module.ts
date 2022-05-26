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
import { AdminToolsModule } from '../admin-tools.module';
import { NewClassFormComponent } from './create-direction/add-class-form/new-class-form/new-class-form.component';
import { ClassesCheckBoxListComponent } from './create-direction/add-class-form/classes-check-box-list/classes-check-box-list.component';
import { InfoFormComponent } from './platform-info/info-edit/info-form/info-form.component';

@NgModule({
  declarations: [
    InfoFormComponent,
    CreateDirectionComponent,
    AddClassFormComponent,
    AddDepartmentFormComponent,
    AddDirectionFormComponent,
    ClassesCheckBoxListComponent,
    NewClassFormComponent,
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

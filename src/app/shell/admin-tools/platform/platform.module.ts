import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutEditComponent } from './about-edit/about-edit.component';
import { SupportEditComponent } from './support-edit/support-edit.component';
import { AboutFormComponent } from './about-edit/about-form/about-form.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SupportFormComponent } from './support-edit/support-form/support-form.component';
import { CreateDirectionComponent } from './create-direction/create-direction.component';
import { AddClassFormComponent } from './create-direction/add-class-form/add-class-form.component';
import { AddDepartmentFormComponent } from './create-direction/add-department-form/add-department-form.component';
import { AddDirectionFormComponent } from './create-direction/add-direction-form/add-direction-form.component';
import { AdminToolsModule } from '../admin-tools.module';
import { ClassesCheckBoxListComponent } from './create-direction/add-department-form/classes-check-box-list/classes-check-box-list.component';

@NgModule({
  declarations: [
    AboutEditComponent,
    SupportEditComponent,
    AboutFormComponent,
    SupportFormComponent,
    CreateDirectionComponent,
    AddClassFormComponent,
    AddDepartmentFormComponent,
    AddDirectionFormComponent,
    ClassesCheckBoxListComponent,

  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    AdminToolsModule,
  ]
})
export class PlatformModule { }

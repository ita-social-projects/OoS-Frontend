import { PlatformRoutingModule } from './platform-routing.module';
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
import { PlatformInfoFormComponent } from './platform-info/platform-info-edit/platform-info-form/platform-info-form.component';
import { PlatformInfoEditComponent } from './platform-info/platform-info-edit/platform-info-edit.component';

@NgModule({
  declarations: [
    PlatformInfoEditComponent,
    PlatformInfoFormComponent,
    CreateDirectionComponent,
    AddClassFormComponent,
    AddDepartmentFormComponent,
    AddDirectionFormComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    PlatformRoutingModule
  ],
  exports: [
  ]
})
export class PlatformModule { }

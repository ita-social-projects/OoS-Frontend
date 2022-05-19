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
import { AboutEditComponent } from './about-platform/about-edit/about-edit.component';
import { SupportEditComponent } from './support-platform/support-edit/support-edit.component';
import { AboutFormComponent } from './about-platform/about-edit/about-form/about-form.component';
import { SupportFormComponent } from './support-platform/support-edit/support-form/support-form.component';
import { AboutPlatformComponent } from './about-platform/about-platform.component';
import { SupportPlatformComponent } from './support-platform/support-platform.component';
import { DirectionsComponent } from './create-direction/directions/directions.component';

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
    DirectionsComponent,
    AboutPlatformComponent,
    SupportPlatformComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    PlatformRoutingModule
  ]
})
export class PlatformModule { }

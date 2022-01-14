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

@NgModule({
  declarations: [
    AboutEditComponent,
    SupportEditComponent,
    AboutFormComponent,
    SupportFormComponent,
    CreateDirectionComponent 
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule
  ]
})
export class PlatformModule { }

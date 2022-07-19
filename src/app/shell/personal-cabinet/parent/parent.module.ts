import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChildFormComponent } from './create-child/child-form/child-form.component'
import { CreateChildComponent } from './create-child/create-child.component';
import { ChildrenComponent } from './children/children.component';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { FavoriteWorkshopsComponent } from './favorite-workshops/favorite-workshops.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { ParentApplicationsComponent } from './parent-applications/parent-applications.component';
import { SharedCabinetModule } from '../shared-cabinet/shared-cabinet.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateChildComponent,
    ChildFormComponent,
    ChildrenComponent,
    CreateApplicationComponent,
    FavoriteWorkshopsComponent,
    ParentApplicationsComponent,
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    SharedCabinetModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
  ]
})
export class ParentModule { }

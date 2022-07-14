import { ParentWorkshopsComponent } from './parent-workshops/parent-workshops.component';
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
import { ParentComponent } from './parent.component';
import { ParentApplicationsComponent } from './parent-applications/parent-applications.component';

@NgModule({
  declarations: [
    CreateChildComponent,
    ChildFormComponent,
    ChildrenComponent,
    CreateApplicationComponent,
    FavoriteWorkshopsComponent,
    ParentWorkshopsComponent,
    ParentApplicationsComponent,
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
  ]
})
export class ParentModule { }

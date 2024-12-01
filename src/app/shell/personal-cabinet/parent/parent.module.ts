import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'shared/shared.module';
import { MaterialModule } from 'shared/modules/material.module';
import { SharedCabinetModule } from '../shared-cabinet/shared-cabinet.module';
import { ParentRoutingModule } from './parent-routing.module';
import { ChildFormComponent } from './create-child/child-form/child-form.component';
import { CreateChildComponent } from './create-child/create-child.component';
import { ChildrenComponent } from './children/children.component';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { FavoriteWorkshopsComponent } from './favorite-workshops/favorite-workshops.component';
import { ParentApplicationsComponent } from './parent-applications/parent-applications.component';
import { ChildCardComponent } from './children/child-card/child-card.component';
import { PersonCardComponent } from './create-application/person-card/person-card.component';
import { CreateParentComponent } from './create-parent/create-parent.component';

@NgModule({
  declarations: [
    CreateChildComponent,
    ChildFormComponent,
    ChildrenComponent,
    CreateApplicationComponent,
    FavoriteWorkshopsComponent,
    ParentApplicationsComponent,
    ChildCardComponent,
    PersonCardComponent,
    CreateParentComponent
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    SharedModule,
    MaterialModule,
    SharedCabinetModule,
    RouterModule,
    FormsModule,
    TranslateModule
  ],
  providers: []
})
export class ParentModule {}

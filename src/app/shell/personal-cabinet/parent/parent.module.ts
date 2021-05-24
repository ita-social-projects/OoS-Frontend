import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ChildFormComponent } from './parent-create-child/child-form/child-form.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';
import { ChildCardComponent } from './parent-config/child-card/child-card.component';
import { CreateApplicationComponent } from '../../workshop-details/create-application/create-application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    ParentConfigComponent,
    ChildCardComponent,
    ParentCreateChildComponent,
    ChildFormComponent,
    CreateApplicationComponent
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [
  ]

})
export class ParentModule { }

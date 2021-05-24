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
import { NgxsModule } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { ChildFormComponent } from './parent-create-child/child-form/child-form.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateApplicationComponent } from '../../workshop-details/create-application/create-application.component';


@NgModule({
  declarations: [
    ParentConfigComponent,
    ParentCreateChildComponent,
    ChildFormComponent,
    ParentInfoComponent,
    CreateApplicationComponent
  ],
  imports: [
    CommonModule,
    ParentRoutingModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    SharedModule
  ],
  providers: [
  ]
})
export class ParentModule { }

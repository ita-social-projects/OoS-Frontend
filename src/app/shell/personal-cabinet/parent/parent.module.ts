import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ChildFormComponent } from './create-child/child-form/child-form.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateChildComponent } from './create-child/create-child.component';
import { ParentInfoComponent } from './parent-info/parent-info.component';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    CreateChildComponent,
    ChildFormComponent,
    ParentInfoComponent,
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
    MatSelectModule,
    SharedModule,
    MatIconModule,
    SharedModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [
  ]
})
export class ParentModule { }

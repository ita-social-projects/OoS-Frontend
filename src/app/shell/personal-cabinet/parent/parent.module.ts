import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ChildCardComponent } from './parent-config/child-card/child-card.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChildCardService } from 'src/app/shared/services/child-cards/child-cards.service';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { NgxsModule } from '@ngxs/store';
import { ParentState } from 'src/app/shared/store/parent.state';
import { MatIconModule } from '@angular/material/icon';
import { ChildFormComponent } from './parent-create-child/child-form/child-form.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';


@NgModule({
  declarations: [
    ParentConfigComponent, 
    ChildCardComponent,
    ParentCreateChildComponent,
    ChildFormComponent,
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
    HttpClientModule,
    NgxsModule.forFeature([ParentState]),
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  providers: [
    ChildCardService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }

  ]
 
})
export class ParentModule { }

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentActivitiesComponent } from './parent-activities/parent-activities.component';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { ChildActivitiesComponent } from './parent-activities/child-activities/child-activities.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from '@angular/material/radio';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChildrenActivitiesListService } from 'src/app/shared/services/children-activities-list/children-activities-list.service';

export function configureRequest(request: HttpRequest<any>, next: HttpHandler): any {
  return () =>{ 
    next.handle(request.clone({
      url: environment.serverUrl + request.url
    }))
  }
}


@NgModule({
  declarations: [
    ParentActivitiesComponent, 
    ParentConfigComponent,
    ChildActivitiesComponent
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
    MatRadioModule
  ],
  providers: [
    ChildrenActivitiesListService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureRequest,
      deps: [HttpRequest],
      multi: true,
    }
  ]
})
export class ParentModule { }

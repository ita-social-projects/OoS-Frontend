import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ActivitiesCardComponent } from './provider-activities/activities-card/activities-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { environment } from 'src/environments/environment';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { APP_INITIALIZER } from '@angular/core';

export function configureRequest(request: HttpRequest<any>): any {
  return () =>{ 
    request.clone({
      url: environment.serverUrl + request.url,
    })
  }
}

@NgModule({
  declarations: [
    ProviderActivitiesComponent,
    ProviderConfigComponent,
    ActivitiesCardComponent],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule
  ],
  providers: [
    ProviderActivitiesService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureRequest,
      deps: [HttpRequest],
      multi: true,
    }
  ]
})
export class ProviderModule { }

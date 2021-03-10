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
import { ReactiveFormsModule } from "@angular/forms";
import { ProviderActivitiesService } from '../../shared/services/provider-activities/provider-activities.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { HttpClientModule } from '@angular/common/http';

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
        MatInputModule,
        ReactiveFormsModule
    ],

  providers: [
    ProviderActivitiesService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ]

})
export class ProviderModule { }

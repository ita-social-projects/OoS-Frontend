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
import { ProviderState } from 'src/app/shared/store/provider.state';
import { NgxsModule } from '@ngxs/store';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { ProviderRequestsComponent } from './provider-requests/provider-requests.component';
import { CreateActivityComponent } from './provider-activities/create-activity/create-activity.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CreateAddressComponent } from './provider-activities/create-activity/create-address/create-address.component';


@NgModule({
  declarations: [
    ProviderActivitiesComponent,
    ProviderConfigComponent,
    ActivitiesCardComponent,
    PersonalCabinetComponent,
    ProviderOrgInfoComponent,
    ProviderRequestsComponent,
    CreateActivityComponent,
    CreateAddressComponent
  ],
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
        ReactiveFormsModule,
        HttpClientModule,
        NgxsModule.forFeature([ProviderState]),
        MatTabsModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatIconModule,
        SharedModule,
        LeafletModule
    ],

  providers: [
    ProviderActivitiesService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ]

})
export class ProviderModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProviderActivitiesComponent} from './provider-activities/provider-activities.component';
import {ProviderConfigComponent} from './provider-config/provider-config.component';
import {ProviderRoutingModule} from './provider-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';

import {ActivitiesCardComponent} from './provider-activities/activities-card/activities-card.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProviderActivitiesService} from '../../shared/services/provider-activities/provider-activities.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpTokenInterceptor} from '../../shared/interceptors/http-token.interceptor';
import {HttpClientModule} from '@angular/common/http';
import {ProviderState} from 'src/app/shared/store/provider.state';
import {NgxsModule} from '@ngxs/store';
import {MatTabsModule} from '@angular/material/tabs';
import {PersonalCabinetComponent} from './personal-cabinet/personal-cabinet.component';
import {MaterialModule} from '../../shared/material/material.module';
import {ProviderConfigService} from './provider-config/provider-config.service';
import {ProviderConfigModalComponent} from './provider-config/provider-config-modal/provider-config-modal.component';
import {CanDeactivateGuard} from './provider-config/can-leave-guard.service';

@NgModule({
  declarations: [
    ProviderActivitiesComponent,
    ProviderConfigComponent,
    ActivitiesCardComponent,
    PersonalCabinetComponent,
    ProviderConfigModalComponent,
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
    MaterialModule,
    FormsModule,
  ],

  providers: [
    ProviderActivitiesService,
    ProviderConfigService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true},
    CanDeactivateGuard
  ],

})
export class ProviderModule {
}

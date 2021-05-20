import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { MatTabsModule } from '@angular/material/tabs';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CreateAddressComponent } from './create-workshop/create-address/create-address.component';
import { CreateAboutFormComponent } from './create-workshop/create-about-form/create-about-form.component';
import { CreateDescriptionFormComponent } from './create-workshop/create-description-form/create-description-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ProviderConfigService } from './provider-config/provider-config.service';
import { CanDeactivateGuard } from './provider-config/can-leave-guard.service';
import { MapComponent } from './create-workshop/create-address/map/map.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { UserState } from 'src/app/shared/store/user.state';
@NgModule({
  declarations: [
    ProviderConfigComponent,
    ProviderOrgInfoComponent,
    CreateAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    MapComponent,
    CreateWorkshopComponent,

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

    MatTabsModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatIconModule,
    SharedModule,
    LeafletModule,
    MatRadioModule,
    FormsModule
  ],

  providers: [
    ProviderConfigService,
    CanDeactivateGuard,
    DatePipe,
    GeolocationService
  ],

})
export class ProviderModule {
}

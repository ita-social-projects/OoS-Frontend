import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MapComponent } from './create-workshop/create-address/map/map.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { CreateProviderComponent } from './create-provider/create-provider.component';
import { CreateInfoFormComponent } from './create-provider/create-info-form/create-info-form.component';
import { CreateContactsFormComponent } from './create-provider/create-contacts-form/create-contacts-form.component';
import { CreatePhotoFormComponent } from './create-provider/create-photo-form/create-photo-form.component';
@NgModule({
  declarations: [
    ProviderOrgInfoComponent,
    CreateAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    MapComponent,
    CreateWorkshopComponent,
    CreateProviderComponent,
    CreateInfoFormComponent,
    CreateContactsFormComponent,
    CreatePhotoFormComponent,
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
    DatePipe,
    GeolocationService
  ],

})
export class ProviderModule {
}

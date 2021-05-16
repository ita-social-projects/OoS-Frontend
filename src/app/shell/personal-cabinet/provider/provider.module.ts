import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { MatTabsModule } from '@angular/material/tabs';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CreateAddressComponent } from './create-workshop/create-address/create-address.component';
import { CreateAboutFormComponent } from './create-workshop/create-about-form/create-about-form.component';
import { CreateDescriptionFormComponent } from './create-workshop/create-description-form/create-description-form.component';
import { ProviderConfigService } from './provider-config/provider-config.service';
import { CanDeactivateGuard } from './provider-config/can-leave-guard.service';
import { MapComponent } from './create-workshop/create-address/map/map.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { UserState } from 'src/app/shared/store/user.state';
import { FlexLayoutModule } from '@angular/flex-layout';

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
    NgxsModule.forFeature([UserState]),
    CommonModule,
    NgxsModule,
    ProviderRoutingModule,
    HttpClientModule,
    MatTabsModule,
    SharedModule,
    LeafletModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule
  ],

  providers: [
    ProviderConfigService,
    CanDeactivateGuard,
    GeolocationService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ],

})
export class ProviderModule {
}

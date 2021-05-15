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
import { ApplicationCardComponent } from '../applications/application-card/application-card.component';
import { UserState } from 'src/app/shared/store/user.state';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
@NgModule({
  declarations: [
    ProviderConfigComponent,
    ProviderOrgInfoComponent,
    CreateAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    MapComponent,
    ApplicationCardComponent,
    CreateWorkshopComponent,
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    HttpClientModule,
    NgxsModule.forFeature([UserState]),
    MatTabsModule,
    SharedModule,
    LeafletModule,
  ],

  providers: [
    ProviderConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    CanDeactivateGuard,
    DatePipe,
    GeolocationService
  ],

})
export class ProviderModule {
}

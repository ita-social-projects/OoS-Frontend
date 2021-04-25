import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ProviderConfigComponent} from './provider-config/provider-config.component';
import {ProviderRoutingModule} from './provider-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './../../shared/interceptors/http-token.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ProviderState } from './../..//shared/store/provider.state';
import { NgxsModule } from '@ngxs/store';
import { MatTabsModule } from '@angular/material/tabs';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { ProviderOrgInfoComponent } from './provider-org-info/provider-org-info.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './../../shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CreateAddressComponent } from './provider-workshops/create-workshop/create-address/create-address.component';
import { CreateAboutFormComponent } from './provider-workshops/create-workshop/create-about-form/create-about-form.component';
import { CreateDescriptionFormComponent } from './provider-workshops/create-workshop/create-description-form/create-description-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ProviderConfigService } from './provider-config/provider-config.service';
import { CanDeactivateGuard } from './provider-config/can-leave-guard.service';
import { ProviderWorkshopsComponent } from './provider-workshops/provider-workshops.component';
import { CreateWorkshopComponent } from './provider-workshops/create-workshop/create-workshop.component';
import { ProviderWorkshopsService } from 'src/app/shared/services/workshops/provider-workshops/provider-workshops';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ApplicationCardComponent } from './provider-applications/application-card/application-card.component';
@NgModule({
  declarations: [
    ProviderWorkshopsComponent,
    ProviderConfigComponent,
    PersonalCabinetComponent,
    ProviderOrgInfoComponent,
    ProviderApplicationsComponent,
    CreateAddressComponent,
    CreateAboutFormComponent,
    CreateDescriptionFormComponent,
    ApplicationCardComponent,
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
    HttpClientModule,
    NgxsModule.forFeature([ProviderState]),
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
    ProviderWorkshopsService,
    ProviderConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    CanDeactivateGuard,
    DatePipe
  ],

})
export class ProviderModule {
}

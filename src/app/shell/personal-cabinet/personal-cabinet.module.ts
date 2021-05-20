import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { ApplicationsComponent } from './applications/applications.component';
import { MessagesComponent } from './messages/messages.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { WorkshopsComponent } from './workshops/workshops.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
@NgModule({
  declarations: [
    ApplicationsComponent,
    ApplicationCardComponent,
    MessagesComponent,
    WorkshopsComponent
  ],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    FlexLayoutModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ParentGuard,
    ProviderGuard,
  ]
})
export class PersonalCabinetModule { }

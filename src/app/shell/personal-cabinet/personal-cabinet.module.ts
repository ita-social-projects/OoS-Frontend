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
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { WorkshopsComponent } from './workshops/workshops.component';



@NgModule({
  declarations: [
    ApplicationsComponent,
    MessagesComponent,
    WorkshopsComponent
  ],
  imports: [
    CommonModule,
    //RouterModule,
    PersonalCabinetRoutingModule,
    FlexLayoutModule,
    SharedModule,
    // GroupModel,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ParentGuard,
    ProviderGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ]
})
export class PersonalCabinetModule { }

import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserState } from 'src/app/shared/store/user.state';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { ApplicationsComponent } from './applications/applications.component';
import { MessagesComponent } from './messages/messages.component';
import { ParentGuard } from './parent/parent.guard';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { ProviderGuard } from './provider/provider.guard';
import { WorkshopsComponent } from './workshops/workshops.component';


@NgModule({
  declarations: [
    PersonalCabinetComponent,
    WorkshopsComponent,
    MessagesComponent,
    ApplicationsComponent,
    ApplicationCardComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NgxsModule.forFeature([UserState]),
    HttpClientModule,
    SharedModule,
    PersonalCabinetRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DatePipe,
    ParentGuard,
    ProviderGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  ],

})
export class PersonalCabinetModule {
}

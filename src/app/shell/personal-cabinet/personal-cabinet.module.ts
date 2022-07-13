import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { ApplicationsComponent } from './applications/applications.component';
import { MessagesComponent } from './messages/messages.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { UserConfigComponent } from './user-config/user-config.component';
import { UserConfigEditComponent } from './user-config/user-config-edit/user-config-edit.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProviderWorkshopsComponent } from './provider/provider-workshops/provider-workshops.component';

@NgModule({
  declarations: [
    ApplicationsComponent,
    ApplicationCardComponent,
    MessagesComponent,
    UserConfigComponent,
    UserConfigEditComponent,
    ProviderWorkshopsComponent,
  ],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    FlexLayoutModule,
    SharedModule,
  ],
  providers: [
    ParentGuard,
    ProviderGuard,
  ]
})
export class PersonalCabinetModule { }

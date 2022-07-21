import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';
import { UserConfigEditComponent } from './shared-cabinet/user-config/user-config-edit/user-config-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedCabinetModule } from './shared-cabinet/shared-cabinet.module';
import { ReasonModalWindowComponent } from './applications/reason-modal-window/reason-modal-window.component';

@NgModule({
  declarations: [
    UserConfigComponent,
    UserConfigEditComponent,
    ReasonModalWindowComponent,
  ],
  imports: [
    CommonModule,
    PersonalCabinetRoutingModule,
    FlexLayoutModule,
    SharedModule,
    SharedCabinetModule
  ],
  providers: [
    ParentGuard,
    ProviderGuard,
  ]
})
export class PersonalCabinetModule { }

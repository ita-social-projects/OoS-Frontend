import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'shared/shared.module';
import { ParentGuard } from './parent/parent.guard';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { ProviderGuard } from './provider/provider.guard';
import { SharedCabinetModule } from './shared-cabinet/shared-cabinet.module';
import { UserConfigEditComponent } from './shared-cabinet/user-config/user-config-edit/user-config-edit.component';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';

@NgModule({
  declarations: [UserConfigComponent, UserConfigEditComponent],
  imports: [CommonModule, PersonalCabinetRoutingModule, FlexLayoutModule, SharedModule, SharedCabinetModule, TranslateModule],
  providers: [ParentGuard, ProviderGuard]
})
export class PersonalCabinetModule {}

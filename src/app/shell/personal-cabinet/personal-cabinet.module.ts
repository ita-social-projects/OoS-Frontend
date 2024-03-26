import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { PersonalCabinetRoutingModule } from './personal-cabinet-routing.module';
import { UserConfigComponent } from './shared-cabinet/user-config/user-config.component';
import { UserConfigEditComponent } from './shared-cabinet/user-config/user-config-edit/user-config-edit.component';
import { SharedCabinetModule } from './shared-cabinet/shared-cabinet.module';

@NgModule({
  declarations: [UserConfigComponent, UserConfigEditComponent],
  imports: [CommonModule, PersonalCabinetRoutingModule, FlexLayoutModule, SharedModule, SharedCabinetModule, TranslateModule],
  providers: [ParentGuard, ProviderGuard]
})
export class PersonalCabinetModule {}

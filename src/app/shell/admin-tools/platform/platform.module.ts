import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'shared/modules/material.module';
import { SharedModule } from 'shared/shared.module';
import { AboutInfoComponent } from './platform-info/about-info.component';
import { InfoCardComponent } from './platform-info/info-card/info-card.component';
import { InfoEditComponent } from './platform-info/info-edit/info-edit.component';
import { MainInfoComponent } from './platform-info/main-info.component';
import { RegulationsInfoComponent } from './platform-info/regulations-info.component';
import { SupportInfoComponent } from './platform-info/support-info.component';
import { PlatformComponent } from './platform.component';

@NgModule({
  declarations: [
    InfoCardComponent,
    AboutInfoComponent,
    RegulationsInfoComponent,
    SupportInfoComponent,
    InfoEditComponent,
    PlatformComponent,
    MainInfoComponent
  ],
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule, TranslateModule],
  exports: [PlatformComponent]
})
export class PlatformModule {}

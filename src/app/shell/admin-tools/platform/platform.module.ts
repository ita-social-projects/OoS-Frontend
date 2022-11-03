import { PlatformComponent } from './platform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { InfoCardComponent } from './platform-info/info-card/info-card.component';
import { RegulationsInfoComponent } from './platform-info/regulations-info.component';
import { SupportInfoComponent } from './platform-info/support-info.component';
import { AboutInfoComponent } from './platform-info/about-info.component';
import { InfoEditComponent } from './platform-info/info-edit/info-edit.component';
import { SharedModule } from '../../../shared/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MainInfoComponent } from './platform-info/main-info.component';

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
  imports: [CommonModule, FlexLayoutModule, SharedModule, MaterialModule, RouterModule],
  exports: [PlatformComponent]
})
export class PlatformModule {}

import { PlatformComponent } from './platform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { DirectionsComponent } from './directions/directions.component';
import { InfoCardComponent } from './platform-info/info-card/info-card.component';
import { RegulationsInfoComponent } from './platform-info/regulations-info.component';
import { SupportInfoComponent } from './platform-info/support-info.component';
import { AboutInfoComponent } from './platform-info/about-info.component';
import { InfoEditComponent } from './platform-info/info-edit/info-edit.component';
import { MainPageInfoComponent } from './main-page-info/main-page-info.component';

@NgModule({
  declarations: [
    DirectionsComponent,
    InfoCardComponent,
    AboutInfoComponent,
    RegulationsInfoComponent,
    SupportInfoComponent,
    InfoEditComponent,
    PlatformComponent,
    MainPageInfoComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [ 
    PlatformComponent
  ]
})
export class PlatformModule { }

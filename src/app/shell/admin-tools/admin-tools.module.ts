import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { PlatformComponent } from './platform/platform.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DirectionsComponent } from './platform/create-direction/directions/directions.component';
import { PlatformInfoComponent } from './platform/platform-info/platform-info.component';

@NgModule({
  declarations: [
    PlatformComponent,
    DirectionsComponent,
    PlatformInfoComponent,
  ],
  imports: [
    CommonModule,
    AdminToolsRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  exports: [
    DirectionsComponent,
    PlatformInfoComponent,
  ]
})
export class AdminToolsModule { }

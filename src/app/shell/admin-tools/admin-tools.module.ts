import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { PlatformComponent } from './platform/platform.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DirectionsComponent } from './platform/create-direction/directions/directions.component';
import { AboutPlatformComponent } from './platform/about-platform/about-platform.component';
import { SupportPlatformComponent } from './platform/support-platform/support-platform.component';

@NgModule({
  declarations: [
    PlatformComponent,
    DirectionsComponent,
    AboutPlatformComponent,
    SupportPlatformComponent,
  ],
  imports: [
    CommonModule,
    AdminToolsRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  exports: [
    DirectionsComponent,
    AboutPlatformComponent,
    SupportPlatformComponent,
  ]
})
export class AdminToolsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { PlatformComponent } from './platform/platform.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DirectionsComponent } from './platform/create-direction/directions/directions.component';
import { ProviderListComponent } from './provider-list/provider-list.component';


@NgModule({
  declarations: [
    PlatformComponent,
    DirectionsComponent,
    ProviderListComponent,
  ],
  imports: [
    CommonModule,
    AdminToolsRoutingModule,
    SharedModule,
    FlexLayoutModule
  ],
  exports: [
    DirectionsComponent
  ]
})
export class AdminToolsModule { }

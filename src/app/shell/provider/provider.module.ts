import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderActivitiesComponent } from './provider-activities/provider-activities.component';
import { ProviderConfigComponent } from './provider-config/provider-config.component';
import { ProviderRoutingModule } from './provider-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ProviderActivitiesComponent,
    ProviderConfigComponent],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule
  ]
})
export class ProviderModule { }

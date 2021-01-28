import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';
import { ResultComponent } from './main/result/result.component';
import { ShowDataComponent } from './main/result/show-data/show-data.component';
import { MapComponent } from './main/result/map/map.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    MainComponent,
    ShellComponent,
    ResultComponent,
    ShowDataComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    MatButtonToggleModule
  ],
  exports: [
    ShellComponent
  ]
})
export class ShellModule { }

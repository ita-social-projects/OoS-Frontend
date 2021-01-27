import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';
import { ResultComponent } from './main/result/result.component';
import { FilteredDataComponent } from './main/result/filtered-data/filtered-data.component';
import { MapComponent } from './main/result/map/map.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    MainComponent,
    ShellComponent,
    ResultComponent,
    FilteredDataComponent,
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

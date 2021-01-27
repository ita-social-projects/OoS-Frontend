import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ShellRoutingModule } from './shell-routing.module';
import { FiltersListComponent } from './main/filters-list/filters-list.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    MainComponent,
    FiltersListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    MatButtonModule
  ]
})
export class ShellModule { }

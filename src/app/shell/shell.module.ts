import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';

@NgModule({
  declarations: [
    MainComponent,
    ShellComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule
  ],
  exports: [
    ShellComponent
  ]
})
export class ShellModule { }

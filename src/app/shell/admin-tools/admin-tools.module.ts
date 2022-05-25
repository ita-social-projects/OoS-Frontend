import { AdminToolsComponent } from './admin-tools.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    UsersComponent,
    AdminToolsComponent
  ],
  imports: [
    CommonModule,
    AdminToolsRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],

  exports: [
    AdminToolsComponent
  ]
})
export class AdminToolsModule {}

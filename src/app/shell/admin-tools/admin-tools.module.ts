import { AdminToolsComponent } from './admin-tools.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdminToolsComponent],
  imports: [CommonModule, AdminToolsRoutingModule, SharedModule, FlexLayoutModule, TranslateModule],

  exports: [AdminToolsComponent]
})
export class AdminToolsModule {}

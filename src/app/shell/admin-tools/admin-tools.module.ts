import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'shared/shared.module';
import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { AdminToolsComponent } from './admin-tools.component';

@NgModule({
  declarations: [AdminToolsComponent],
  imports: [CommonModule, AdminToolsRoutingModule, SharedModule, TranslateModule],
  exports: [AdminToolsComponent]
})
export class AdminToolsModule {}

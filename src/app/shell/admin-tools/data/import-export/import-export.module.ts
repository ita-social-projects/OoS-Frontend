import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';
import { MaterialModule } from 'shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SharedCabinetModule } from '../../../personal-cabinet/shared-cabinet/shared-cabinet.module';
import { ImportProvidersComponent } from './import-providers/import-providers.component';
import { ExportProvidersComponent } from './export-providers/export-providers.component';
import { ImportExportRoutingModule } from './import-export-routing.module';
import { ImportExportComponent } from './import-export.component';

@NgModule({
  declarations: [ImportExportComponent, ImportProvidersComponent, ExportProvidersComponent],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    SharedCabinetModule,
    ImportExportRoutingModule
  ],
  exports: [ImportExportComponent]
})
export class ImportExportModule {}

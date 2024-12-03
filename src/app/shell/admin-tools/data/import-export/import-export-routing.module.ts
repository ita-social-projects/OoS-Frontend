import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportProvidersComponent } from './import-providers/import-providers.component';
import { ExportProvidersComponent } from './export-providers/export-providers.component';

const routes: Routes = [
  { path: '', component: ExportProvidersComponent },
  { path: 'import-providers', component: ImportProvidersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportExportRoutingModule {}

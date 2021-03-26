import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShellRoutingModule } from './shell-routing.module';
import { ResultComponent } from './main/result/result.component';
import { OrganizationCardsListComponent } from './main/result/organization-cards-list/organization-cards-list.component';
import { MapComponent } from './main/result/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { OrderingComponent } from './main/result/ordering/ordering.component';
import { SharedModule } from '../shared/shared.module';
import { ParentGuard } from './parent/parent.guard';
import { ProviderGuard } from './provider/provider.guard';
import { GroupModel } from './section/group/group.model';


@NgModule({
  declarations: [
    MainComponent,
    MapComponent,
    ResultComponent,
    OrganizationCardsListComponent,
    OrderingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    LeafletModule,
    SharedModule,
    GroupModel,
  ],
  providers: [
    ParentGuard,
    ProviderGuard
  ]
})
export class ShellModule { }

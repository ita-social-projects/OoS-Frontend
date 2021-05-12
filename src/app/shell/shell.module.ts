import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShellRoutingModule } from './shell-routing.module';
import { ResultComponent } from './result/result.component';
import { WorkshopCardsListComponent } from './result/workshop-cards-list/workshop-cards-list.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { OrderingComponent } from './result/ordering/ordering.component';
import { SharedModule } from '../shared/shared.module';
import { ParentGuard } from './personal-cabinet/parent/parent.guard';
import { GroupModel } from './section/group/group.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { ApplicationsComponent } from './personal-cabinet/applications/applications.component';
import { MessagesComponent } from './personal-cabinet/messages/messages.component';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { WorkshopsComponent } from './personal-cabinet/workshops/workshops.component';


@NgModule({
  declarations: [
    MainComponent,
    ResultComponent,
    WorkshopCardsListComponent,
    WorkshopsComponent,
    OrderingComponent,
    ApplicationsComponent,
    MessagesComponent,
    PersonalCabinetComponent
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
    NgxPaginationModule
  ],
  providers: [
    ParentGuard,
    ProviderGuard
  ]
})
export class ShellModule { }

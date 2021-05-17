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
import { ReactiveFormsModule } from '@angular/forms';
import { CreateApplicationComponent } from './section/group/create-application/create-application.component';
import { PersonalCabinetModule } from './personal-cabinet/personal-cabinet.module';


@NgModule({
  declarations: [
    MainComponent,
    ResultComponent,
    WorkshopCardsListComponent,
    OrderingComponent,
    PersonalCabinetComponent,
    CreateApplicationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    FlexLayoutModule,
    LeafletModule,
    SharedModule,
    GroupModel,
    NgxPaginationModule,
    ReactiveFormsModule,
  ]
})
export class ShellModule { }

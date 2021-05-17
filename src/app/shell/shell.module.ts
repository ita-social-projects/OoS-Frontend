import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShellRoutingModule } from './shell-routing.module';
import { ResultComponent } from './result/result.component';
import { WorkshopCardsListComponent } from './result/workshop-cards-list/workshop-cards-list.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MainComponent } from './main/main.component';
import { OrderingComponent } from './result/ordering/ordering.component';
import { SharedModule } from '../shared/shared.module';
import { GroupModel } from './section/group/group.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateApplicationComponent } from './section/group/create-application/create-application.component';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';


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
  ],
  providers: [
  ]
})
export class ShellModule { }

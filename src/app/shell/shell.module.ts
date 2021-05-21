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
import { NgxPaginationModule } from 'ngx-pagination';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from '../shared/interceptors/http-token.interceptor';
@NgModule({
  declarations: [
    MainComponent,
    ResultComponent,
    WorkshopCardsListComponent,
    OrderingComponent,
    PersonalCabinetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    FlexLayoutModule,
    LeafletModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    PersonalCabinetGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true
    // }
  ]
})
export class ShellModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { HttpTokenInterceptor } from '../shared/interceptors/http-token.interceptor';
import { MOMENT_DATE_FORMATS } from '../shared/constants/constants';
import { ShellRoutingModule } from './shell-routing.module';
import { ResultComponent } from './result/result.component';
import { WorkshopCardsListComponent } from './result/workshop-cards-list/workshop-cards-list.component';
import { MainComponent } from './main/main.component';
import { OrderingComponent } from './result/ordering/ordering.component';
import { PersonalCabinetComponent } from './personal-cabinet/personal-cabinet.component';
import { PersonalCabinetGuard } from './personal-cabinet/personal-cabinet.guard';
import { ProviderGuard } from './personal-cabinet/provider/provider.guard';
import { ParentGuard } from './personal-cabinet/parent/parent.guard';
import { CreateProviderGuard } from './personal-cabinet/provider/create-provider/create-provider.guard';
import { WorkshopMapViewListComponent } from './result/workshop-map-view-list/workshop-map-view-list.component';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AboutComponent } from './info/about/about.component';
import { SupportComponent } from './info/support/support.component';
import { InfoComponent } from './info/info.component';
import { AdminToolsGuard } from './admin-tools/admin-tools.guard';
import { IsMobileGuard } from './is-mobile.guard';
import { RulesComponent } from './info/rules/rules.component';
import { NotProviderAdminGuard } from './personal-cabinet/provider/not-provider-admin.guard';

@NgModule({
  declarations: [
    MainComponent,
    ResultComponent,
    WorkshopCardsListComponent,
    OrderingComponent,
    PersonalCabinetComponent,
    WorkshopMapViewListComponent,
    AllCategoriesComponent,
    AboutComponent,
    SupportComponent,
    InfoComponent,
    RulesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    LeafletModule,
    SharedModule,
    NgxPaginationModule,
    HttpClientModule,
    FlexLayoutModule,
    TranslateModule
  ],
  providers: [
    PersonalCabinetGuard,
    AdminToolsGuard,
    ProviderGuard,
    ParentGuard,
    CreateProviderGuard,
    IsMobileGuard,
    NotProviderAdminGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ShellModule {}

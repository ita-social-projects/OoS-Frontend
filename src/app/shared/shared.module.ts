import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { AchievementCardComponent } from '../shell/details/details-tabs/achievements/achievement-card/achievement-card.component';
import { RateComponent } from '../shell/details/details-tabs/reviews/rate/rate.component';
import { StarsComponent } from '../shell/details/details-tabs/reviews/stars/stars.component';
// eslint-disable-next-line max-len
import { WorkingHoursFormComponent } from '../shell/personal-cabinet/provider/create-workshop/create-about-form/working-hours-form-wrapper/working-hours-form/working-hours-form.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { ConfirmationModalWindowComponent } from './components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from './components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { EntityCheckboxDropdownComponent } from './components/entity-checkbox-dropdown/entity-checkbox-dropdown.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AgeFilterComponent } from './components/filters-list/age-filter/age-filter.component';
import { CategoryCheckBoxComponent } from './components/filters-list/category-check-box/category-check-box.component';
import { CityFilterComponent } from './components/filters-list/city-filter/city-filter.component';
import { FiltersListComponent } from './components/filters-list/filters-list.component';
import { FullSearchBarComponent } from './components/filters-list/full-search-bar/full-search-bar.component';
import { PriceFilterComponent } from './components/filters-list/price-filter/price-filter.component';
import { SearchbarComponent } from './components/filters-list/searchbar/searchbar.component';
import { UserRadiusSetComponent } from './components/filters-list/user-radius-set/user-radius-set.component';
import { WorkingHoursComponent } from './components/filters-list/working-hours/working-hours.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { ImageCropperModalComponent } from './components/image-cropper-modal/image-cropper-modal.component';
import { ImageFormControlComponent } from './components/image-form-control/image-form-control.component';
import { InfoFormComponent } from './components/info-form/info-form.component';
import { InfoMenuComponent } from './components/info-menu/info-menu.component';
import { InstitutionHierarchyComponent } from './components/institution-hierarchy/institution-hierarchy.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { MessageBarComponent } from './components/message-bar/message-bar.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavigationMobileBarComponent } from './components/navigation-mobile-bar/navigation-mobile-bar.component';
import { NoResultCardComponent } from './components/no-result-card/no-result-card.component';
import { NotificationsListComponent } from './components/notifications/notifications-list/notifications-list.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PhoneFormControlComponent } from './components/phone-form-control/phone-form-control.component';
import { ProviderInfoComponent } from './components/provider-info/provider-info.component';
import { ProviderStatusBannerComponent } from './components/provider-status-banner/provider-status-banner.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { SidenavFiltersComponent } from './components/sidenav-filters/sidenav-filters.component';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';
import { StatusInfoCardComponent } from './components/status-info-card/status-info-card.component';
import { StretchCellComponent } from './components/stretch-cell/stretch-cell/stretch-cell.component';
// eslint-disable-next-line max-len
import { UnregisteredUserWarningModalComponent } from './components/unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ValidationHintComponent } from './components/validation-hint/validation-hint.component';
import { WorkshopCardComponent } from './components/workshop-card/workshop-card.component';
import { WorkshopSeatsLackModalComponent } from './components/workshop-card/workshop-seats-lack-modal/workshop-seats-lack-modal.component';
import { CustomCarouselDirective } from './directives/custom-carousel.directive';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { KeyFilterDirective } from './directives/key-filter.directive';
import { MinMaxDirective } from './directives/min-max.directive';
import { PlaceholderFormDirective } from './directives/placeholder-styling.directive';
import { ShowTooltipIfTruncatedDirective } from './directives/show-tooltip-if-truncated.directive';
import { StretchTableDirective } from './directives/stretch-table/stretch-table.directive';
import { TrimValueDirective } from './directives/trim-value.directive';
import { ValidationMessageStylingDirective } from './directives/validation-message-styling.directive';
import { MaterialModule } from './modules/material.module';
import { ApplicationChildFilterPipe } from './pipes/application-child-filter.pipe';
import { ApplicationChildSortingPipe } from './pipes/application-child-sorting.pipe';
import { ApplicationFilterPipe } from './pipes/application-filter.pipe';
import { DeclinationPipe } from './pipes/declination.pipe';
import { EmptyValueTransformPipe } from './pipes/empty-value-transform.pipe';
import { GetAddressPipe } from './pipes/get-address.pipe';
import { GetFullNamePipe } from './pipes/get-full-name.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { NotificationDescriptionPipe } from './pipes/notification-description.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { TextSliceTransformPipe } from './pipes/text-slice-transform.pipe';
import { TranslateCasesPipe } from './pipes/translate-cases.pipe';

@NgModule({
  declarations: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    WorkshopCardComponent,
    CategoryCardComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    WorkingHoursComponent,
    PriceFilterComponent,
    CategoryCheckBoxComponent,
    ApplicationChildFilterPipe,
    MapComponent,
    ConfirmationModalWindowComponent,
    ReasonModalWindowComponent,
    PlaceholderFormDirective,
    ValidationMessageStylingDirective,
    NavigationBarComponent,
    EntityCheckboxDropdownComponent,
    NavigationMobileBarComponent,
    FullSearchBarComponent,
    MessageBarComponent,
    ShowTooltipIfTruncatedDirective,
    PaginatorComponent,
    SidenavMenuComponent,
    ScrollToTopComponent,
    StatusInfoCardComponent,
    NoResultCardComponent,
    WorkingHoursFormComponent,
    SidenavFiltersComponent,
    NotificationsComponent,
    NotificationsListComponent,
    UsersListComponent,
    KeyFilterDirective,
    CustomCarouselDirective,
    PhonePipe,
    DeclinationPipe,
    ProviderInfoComponent,
    ApplicationChildSortingPipe,
    ValidationHintComponent,
    TrimValueDirective,
    InstitutionHierarchyComponent,
    ImageCropperModalComponent,
    InfoFormComponent,
    LoginComponent,
    StarsComponent,
    ErrorPageComponent,
    AchievementCardComponent,
    StarsComponent,
    RateComponent,
    JoinPipe,
    GetFullNamePipe,
    TextSliceTransformPipe,
    StretchCellComponent,
    StretchTableDirective,
    UserRadiusSetComponent,
    UnregisteredUserWarningModalComponent,
    EmptyValueTransformPipe,
    GetAddressPipe,
    TranslateCasesPipe,
    ProviderStatusBannerComponent,
    WorkshopSeatsLackModalComponent,
    PhoneFormControlComponent,
    NotificationDescriptionPipe,
    InfoMenuComponent,
    ImageCarouselComponent,
    CustomCarouselDirective
  ],

  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgxSliderModule,
    NgxMatTimepickerModule,
    NgxMatIntlTelInputComponent,
    ImageCropperModule,
    TranslateModule,
    CdkAccordionModule
  ],

  exports: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    WorkshopCardComponent,
    MaterialModule,
    CategoryCardComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    FormsModule,
    CategoryCheckBoxComponent,
    MapComponent,
    ApplicationChildFilterPipe,
    ConfirmationModalWindowComponent,
    ReasonModalWindowComponent,
    PlaceholderFormDirective,
    ValidationMessageStylingDirective,
    NavigationBarComponent,
    NavigationMobileBarComponent,
    EntityCheckboxDropdownComponent,
    FullSearchBarComponent,
    MessageBarComponent,
    ShowTooltipIfTruncatedDirective,
    PaginatorComponent,
    ReactiveFormsModule,
    SidenavMenuComponent,
    ScrollToTopComponent,
    StatusInfoCardComponent,
    NoResultCardComponent,
    WorkingHoursFormComponent,
    SidenavFiltersComponent,
    NotificationsComponent,
    UsersListComponent,
    ProviderInfoComponent,
    KeyFilterDirective,
    CustomCarouselDirective,
    PhonePipe,
    DeclinationPipe,
    ApplicationChildSortingPipe,
    ValidationHintComponent,
    TrimValueDirective,
    InstitutionHierarchyComponent,
    ImageCropperModalComponent,
    InfoFormComponent,
    AchievementCardComponent,
    StarsComponent,
    RateComponent,
    JoinPipe,
    GetFullNamePipe,
    TextSliceTransformPipe,
    StretchCellComponent,
    StretchTableDirective,
    UserRadiusSetComponent,
    UnregisteredUserWarningModalComponent,
    EmptyValueTransformPipe,
    GetAddressPipe,
    TranslateCasesPipe,
    ProviderStatusBannerComponent,
    PhoneFormControlComponent,
    InfoMenuComponent
  ]
})
export class SharedModule {}

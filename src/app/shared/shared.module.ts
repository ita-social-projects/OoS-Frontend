import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersListComponent } from './components/filters-list/filters-list.component';
import { AgeFilterComponent } from './components/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './components/filters-list/searchbar/searchbar.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { CityFilterComponent } from './components/filters-list/city-filter/city-filter.component';
import { WorkshopCardComponent, WorkshopCardDialog } from './components/workshop-card/workshop-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TeacherCardComponent } from './components/teacher-card/teacher-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { CategorySelectComponent } from './components/category-select/category-select.component';
import { CityAutocompleteComponent } from './components/city-autocomplete/city-autocomplete.component';
import { MinMaxDirective } from './directives/min-max.directive';
import { ImageFormControlComponent } from './components/image-form-control/image-form-control.component';
import { ApplicationFilterPipe } from './pipes/application-filter.pipe';
import { ChildInfoBoxComponent } from './components/child-info-box/child-info-box.component';
import { InfoBoxHostDirective } from './directives/info-box-host.directive';
import { PriceFilterComponent } from './components/filters-list/price-filter/price-filter.component';
import { FormsModule } from '@angular/forms';
import { CategoryCheckBoxComponent } from './components/filters-list/category-check-box/category-check-box.component';
import { PersonCardComponent } from './components/person-card/person-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { WorkingHoursComponent } from './components/filters-list/working-hours/working-hours.component';
import { WorkingHoursFormControlComponent } from './components/working-hours-form-control/working-hours-form-control.component';
import { ChildCardComponent } from './components/child-card/child-card.component';
import { ApplicationChildFilterPipe } from './pipes/application-child-filter.pipe';
import { MapComponent } from './components/map/map.component';
import { ConfirmationModalWindowComponent } from './components/confirmation-modal-window/confirmation-modal-window.component';
import { PlaceholderFormDirective } from './directives/placeholder-styling.directive';
import { ValidationMessageStyling } from './directives/validation-message-styling.directive';
import { ValidationHintForInputComponent } from './components/validation-hint-for-input/validation-hint-for-input.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { WorkshopCheckboxDropdownComponent } from './components/workshop-checkbox-dropdown/workshop-checkbox-dropdown.component';
import { NavigationMobileBarComponent } from './components/navigation-mobile-bar/navigation-mobile-bar.component';
import { FullSearchBarComponent } from './components/full-search-bar/full-search-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MessageBarComponent } from './components/message-bar/message-bar.component';
import { ShowTooltipIfTruncatedDirective } from './directives/show-tooltip-if-truncated.directive';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { StarsComponent } from './components/stars/stars.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../footer/footer.component';
import { CityConfirmationComponent } from './components/city-confirmation/city-confirmation.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { StatusInfoCardComponent } from './components/status-info-card/status-info-card.component';
import { NoResultCardComponent } from './components/no-result-card/no-result-card.component';
import { MaterialModule } from './modules/material.module';

@NgModule({
  declarations: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    WorkshopCardComponent,
    TeacherCardComponent,
    CategorySelectComponent,
    CategoryCardComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    ChildInfoBoxComponent,
    InfoBoxHostDirective,
    WorkingHoursComponent,
    PriceFilterComponent,
    CategoryCheckBoxComponent,
    PersonCardComponent,
    WorkingHoursFormControlComponent,
    ChildCardComponent,
    ApplicationChildFilterPipe,
    MapComponent,
    ConfirmationModalWindowComponent,
    PlaceholderFormDirective,
    ValidationMessageStyling,
    ValidationHintForInputComponent,
    NavigationBarComponent,
    WorkshopCheckboxDropdownComponent,
    NavigationMobileBarComponent,
    FullSearchBarComponent,
    MessageBarComponent,
    ShowTooltipIfTruncatedDirective,
    PaginatorComponent,
    StarsComponent,
    FooterComponent,
    CityConfirmationComponent,
    SidenavComponent,
    ScrollToTopComponent,
    StatusInfoCardComponent,
    NoResultCardComponent,
    WorkshopCardDialog
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    NgxSliderModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  exports: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    WorkshopCardComponent,
    MaterialModule,
    TeacherCardComponent,
    CategorySelectComponent,
    CategoryCardComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    ChildInfoBoxComponent,
    InfoBoxHostDirective,
    FormsModule,
    CategoryCheckBoxComponent,
    PersonCardComponent,
    WorkingHoursFormControlComponent,
    ChildCardComponent,
    MapComponent,
    ApplicationChildFilterPipe,
    ConfirmationModalWindowComponent,
    PlaceholderFormDirective,
    ValidationMessageStyling,
    ValidationHintForInputComponent,
    NavigationBarComponent,
    NavigationMobileBarComponent,
    WorkshopCheckboxDropdownComponent,
    FullSearchBarComponent,
    MessageBarComponent,
    MatProgressBarModule,
    ShowTooltipIfTruncatedDirective,
    PaginatorComponent,
    ReactiveFormsModule,
    StarsComponent,
    FooterComponent,
    CityConfirmationComponent,
    SidenavComponent,
    ScrollToTopComponent,
    StatusInfoCardComponent,
    NoResultCardComponent,
    WorkshopCardDialog
  ]
})
export class SharedModule { }

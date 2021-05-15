import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersListComponent } from './components/filters-list/filters-list.component';
import { AgeFilterComponent } from './components/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './components/filters-list/searchbar/searchbar.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { CityFilterComponent } from './components/filters-list/city-filter/city-filter.component';
import { MaterialModule } from './material/material.module';
import { WorkshopCardComponent } from './components/workshop-card/workshop-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TeacherCardComponent } from './components/teacher-card/teacher-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { CreateTeacherComponent } from './components/create-teacher/create-teacher.component';
import { TeacherFormComponent } from './components/create-teacher/teacher-form/teacher-form.component';
import { CategorySelectComponent } from './components/category-select/category-select.component';
import { CityAutocompleteComponent } from './components/city-autocomplete/city-autocomplete.component';
import { MinMaxDirective } from './directives/min-max.directive';
import { ImageFormControlComponent } from './components/image-form-control/image-form-control.component';
import { ApplicationFilterPipe } from './pipes/application-filter.pipe';
import { ApplicationSortPipe } from './pipes/application-sort.pipe';
import { ChildInfoBoxComponent } from './components/child-info-box/child-info-box.component';
import { InfoBoxHostDirective } from './directives/info-box-host.directive';
import { CategoriesDropdownComponent } from './components/categories-dropdown/categories-dropdown.component';
import { PriceFilterComponent } from './components/filters-list/price-filter/price-filter.component';
import { FormsModule } from '@angular/forms';
import { CategoryCheckBoxComponent } from './components/filters-list/category-check-box/category-check-box.component';
import { PersonCardComponent } from './components/person-card/person-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { WorkingHoursComponent } from './components/filters-list/working-hours/working-hours.component';


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
    CreateTeacherComponent,
    TeacherFormComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    ApplicationSortPipe,
    ChildInfoBoxComponent,
    InfoBoxHostDirective,
    CategoriesDropdownComponent,
    WorkingHoursComponent,
    PriceFilterComponent,
    CategoryCheckBoxComponent,
    PersonCardComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
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
    CreateTeacherComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent,
    ApplicationFilterPipe,
    ApplicationSortPipe,
    ChildInfoBoxComponent,
    InfoBoxHostDirective,
    CategoriesDropdownComponent,
    FormsModule,
    CategoryCheckBoxComponent,
    PersonCardComponent,
  ]
})
export class SharedModule { }

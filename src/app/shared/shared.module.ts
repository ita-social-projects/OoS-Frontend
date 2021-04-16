import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersListComponent } from './components/filters-list/filters-list.component';
import { AgeFilterComponent } from './components/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './components/filters-list/searchbar/searchbar.component';
import { CategoriesFilterComponent } from './components/filters-list/categories-filter/categories-filter.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { CityFilterComponent } from './components/filters-list/city-filter/city-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { OrganizationCardComponent } from './components/organization-card/organization-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TeacherCardComponent } from './components/teacher-card/teacher-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { CreateTeacherComponent } from './components/create-teacher/create-teacher.component';
import { TeacherFormComponent } from './components/create-teacher/teacher-form/teacher-form.component';
import { HobbySelectComponent } from './components/hobby-select/hobby-select.component';
import { CityAutocompleteComponent } from './components/city-autocomplete/city-autocomplete.component';
import { ImageInputComponent } from './components/image-input/image-input.component';
import { MinMaxDirective } from './directives/min-max.directive';
import { ImageFormControlComponent } from './components/image-form-control/image-form-control.component';

@NgModule({
  declarations: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CategoriesFilterComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    OrganizationCardComponent,
    TeacherCardComponent,
    HobbySelectComponent,
    CategoryCardComponent,
    CreateTeacherComponent,
    TeacherFormComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CategoriesFilterComponent,
    CityFilterComponent,
    DigitOnlyDirective,
    OrganizationCardComponent,
    MaterialModule,
    TeacherCardComponent,
    HobbySelectComponent,
    CategoryCardComponent,
    CreateTeacherComponent,
    CityAutocompleteComponent,
    MinMaxDirective,
    ImageFormControlComponent
  ]
})
export class SharedModule { }

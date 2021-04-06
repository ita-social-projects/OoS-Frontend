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
import { HobbySelectComponent } from './components/hobby-select/hobby-select.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';



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
    CategoryCardComponent
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
    CategoryCardComponent
  ]
})
export class SharedModule { }

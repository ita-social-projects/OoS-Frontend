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
import { WorkshopCardComponent } from './components/workshop-card/workshop-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TeacherCardComponent } from './components/teacher-card/teacher-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { CreateTeacherComponent } from './components/create-teacher/create-teacher.component';
import { TeacherFormComponent } from './components/create-teacher/teacher-form/teacher-form.component';
import { CategorySelectComponent } from './components/hobby-select/category-select.component';
import { CityAutocompleteComponent } from './components/city-autocomplete/city-autocomplete.component';
import { MinMaxDirective } from './directives/min-max.directive';
import { ImageFormControlComponent } from './components/image-form-control/image-form-control.component';
import { ApplicationFilterPipe } from './pipes/application-filter.pipe';
import { ApplicationSortPipe } from './pipes/application-sort.pipe';
import { ChildInfoBoxComponent } from './components/child-info-box/child-info-box.component';
import { MatCardModule } from '@angular/material/card';
import { BoxtipDirective } from './directives/boxtip.directive';
@NgModule({
  declarations: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CategoriesFilterComponent,
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
    BoxtipDirective,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule,
    MatCardModule
  ],
  exports: [
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    CategoriesFilterComponent,
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
    MatCardModule,
    ChildInfoBoxComponent
  ]
})
export class SharedModule { }

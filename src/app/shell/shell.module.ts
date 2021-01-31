import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { ShellRoutingModule } from './shell-routing.module';

import { MainComponent } from './main/main.component';
import { FiltersListComponent } from './main/filters-list/filters-list.component';
import { AgeFilterComponent } from './main/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './main/filters-list/searchbar/searchbar.component';
import { OwnershipTypeFilterComponent } from './main/filters-list/ownership-type-filter/ownership-type-filter.component';
import { CategoriesFilterComponent } from './main/filters-list/categories-filter/categories-filter.component';
import { DigitOnlyDirective } from '../shared/directives/digit-only.directive';



@NgModule({
  declarations: [
    MainComponent,
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    OwnershipTypeFilterComponent,
    CategoriesFilterComponent,
    DigitOnlyDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ]
})
export class ShellModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';

import { MainComponent } from './main/main.component';
import { FiltersListComponent } from './main/filters-list/filters-list.component';
import { AgeFilterComponent } from './main/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './main/filters-list/searchbar/searchbar.component';
import { OwnershipTypeFilterComponent } from './main/filters-list/ownership-type-filter/ownership-type-filter.component';
import { CategoriesFilterComponent } from './main/filters-list/categories-filter/categories-filter.component';


@NgModule({
  declarations: [
    MainComponent,
<<<<<<< HEAD
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    OwnershipTypeFilterComponent,
    CategoriesFilterComponent
=======
    ShellComponent
>>>>>>> origin/develop
  ],
  imports: [
    CommonModule,
    RouterModule,
<<<<<<< HEAD
    ShellRoutingModule,
    MatButtonModule,
    FlexLayoutModule
=======
    ShellRoutingModule
  ],
  exports: [
    ShellComponent
>>>>>>> origin/develop
  ]
})
export class ShellModule { }

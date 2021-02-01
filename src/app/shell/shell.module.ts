import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ShellRoutingModule } from './shell-routing.module';
import { ShellComponent } from './shell.component';
import { ResultComponent } from './main/result/result.component';
import { HobbyGroupsListComponent } from './main/result/hobby-groups-list/hobby-groups-list.component';
import { MapComponent } from './main/result/map/map.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


import { MainComponent } from './main/main.component';
import { FiltersListComponent } from './main/filters-list/filters-list.component';
import { AgeFilterComponent } from './main/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './main/filters-list/searchbar/searchbar.component';
import { OwnershipTypeFilterComponent } from './main/filters-list/ownership-type-filter/ownership-type-filter.component';
import { CategoriesFilterComponent } from './main/filters-list/categories-filter/categories-filter.component';
import { CityFilterComponent } from './main/filters-list/city-filter/city-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    MainComponent,
    ShellComponent,
<<<<<<< HEAD
=======
    ResultComponent,
    HobbyGroupsListComponent,
    MapComponent,
>>>>>>> develop
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    OwnershipTypeFilterComponent,
<<<<<<< HEAD
    CategoriesFilterComponent,
    CityFilterComponent
=======
    CategoriesFilterComponent
>>>>>>> develop
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    MatButtonModule,
<<<<<<< HEAD
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    HttpClientModule
=======
    FlexLayoutModule
  ],
  exports: [
    ShellComponent
>>>>>>> develop
  ]
})
export class ShellModule { }

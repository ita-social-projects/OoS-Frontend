import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { ShellRoutingModule } from './shell-routing.module';
import { ResultComponent } from './main/result/result.component';
import { HobbyGroupsListComponent } from './main/result/hobby-groups-list/hobby-groups-list.component';
import { MapComponent } from './main/result/map/map.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MainComponent } from './main/main.component';
import { FiltersListComponent } from './main/filters-list/filters-list.component';
import { AgeFilterComponent } from './main/filters-list/age-filter/age-filter.component';
import { SearchbarComponent } from './main/filters-list/searchbar/searchbar.component';
import { OwnershipTypeFilterComponent } from './main/filters-list/ownership-type-filter/ownership-type-filter.component';
import { CategoriesFilterComponent } from './main/filters-list/categories-filter/categories-filter.component';
import { DigitOnlyDirective } from '../shared/directives/digit-only.directive';
import { CityFilterComponent } from './main/filters-list/city-filter/city-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderingComponent } from './main/result/hobby-groups-list/ordering/ordering.component';



@NgModule({
  declarations: [
    MainComponent,
    FiltersListComponent,
    AgeFilterComponent,
    SearchbarComponent,
    OwnershipTypeFilterComponent,
    CategoriesFilterComponent,
    DigitOnlyDirective,
    CityFilterComponent,
    MapComponent,
    ResultComponent,
    HobbyGroupsListComponent,
    OrderingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShellRoutingModule,
    MatButtonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    HttpClientModule,
    MatButtonToggleModule
  ]
})
export class ShellModule { }

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../store/meta-data.state';
import { CityList } from '../../store/meta-data.actions';
import { CityFilterService } from '../../services/filters-services/city-filter/city-filter.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-autocomplete',
  templateUrl: './city-autocomplete.component.html',
  styleUrls: ['./city-autocomplete.component.scss']
})
export class CityAutocompleteComponent implements OnInit {

  city:City;
  cityControl = new FormControl();
  cities: City[] = [];
  noCity: boolean=false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() selectedCity = new EventEmitter();

  @Select(MetaDataState.filteredCities)
  filteredCities$: Observable<City[]>;
  

  constructor(public filterCityService: CityFilterService, public store: Store) { }
  ngOnInit(): void {
    this.filterCityService.fetchCities()
      .subscribe((data)=>{
        this.cities=data;
    })
    
    this.cityControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),   
      ).subscribe(value => {
        if (value) {
          this.store.dispatch(new CityList(this._filter(value)));
        }else{
          this.store.dispatch(new CityList([]));
        };
      });
  }
  /**
   * This method filters the list of all cities according to the value of input;
   * If the input value does not match with options
   * the further selection is disabled and a user receive "Такого міста немає"
   * @param string value
   * @returns string[] 
   */
  private _filter(value: string): City[] {
    let filteredCities =  this.cities
      .filter(c => c.city
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map(c=> c);

    if(filteredCities.length===0){
      this.noCity=true;
      return [ { id:null, city:"Такого міста немає" } ]
    }else{
      this.noCity=false;
      return filteredCities;
    }
  }
  /**
   * This method selects an option from the list of filtered cities as a chosen city
   * and pass this value to teh parent component
   * @param MatAutocompleteSelectedEvent value 
   */
  onSelect(event: MatAutocompleteSelectedEvent): void {
    this.selectedCity.emit(event.option.value);
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

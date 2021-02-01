import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, SelectorOptions, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { SelectCity } from '../../../../shared/store/app.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';

import { CityFilterService } from '../../../../shared/filters-services/city-filter.service';
import { CityList } from '../../../../shared/store/meta-data.actions';




@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit {

  cityControl = new FormControl();
  cities: string[] = [];
  noCity: boolean=false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.filteredCities)
  filteredCities$: Observable<string[]>;
  

  constructor(public filterCityService: CityFilterService, public store: Store) { }
  ngOnInit(): void {
    this.filterCityService.fetchCities()
      .subscribe((data)=>{
        this.cities=data;
    })
    
    this.onInit();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let filteredCities = this.cities.filter(city => city.toLowerCase().startsWith(filterValue));
    if(filteredCities.length===0){
      this.noCity=true;
      return ["Такого міста немає"]
    }else{
      this.noCity=false;
      return filteredCities;
    }
    
  }
  onSelect(event){
    this.store.dispatch(new SelectCity(event.option.value))
  }
  
  onInit(){
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
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

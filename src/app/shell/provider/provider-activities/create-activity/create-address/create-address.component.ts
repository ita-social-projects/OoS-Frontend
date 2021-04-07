import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { CityFilterService } from './../../../../../shared/services/filters-services/city-filter/city-filter.service';
import { CityList } from './../../../../../shared/store/meta-data.actions';
import { MetaDataState } from './../../../../../shared/store/meta-data.state';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  AddressFormGroup: FormGroup;

  @Output() passAddressFormGroup = new EventEmitter();
  cities: string[] = [];
  noCity: boolean=false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectedCity:string;

  @Select(MetaDataState.filteredCities)
  filteredCities$: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    public filterCityService: CityFilterService, 
    public store: Store
    ){
    
    this.AddressFormGroup = this.formBuilder.group({
    street: new FormControl(''), 
    buildingNumber: new FormControl(''),
    city: new FormControl()
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
    
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

  onInit(){
    this.AddressFormGroup.get('city').valueChanges
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

  onSelect(event){
    this.selectedCity = event.option.value;
  }

}

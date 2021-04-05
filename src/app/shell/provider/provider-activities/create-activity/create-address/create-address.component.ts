import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Address } from 'src/app/shared/models/address.model';
import { CityFilterService } from 'src/app/shared/services/filters-services/city-filter/city-filter.service';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { CityList } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {

  //for autocomplete
  
  cities: string[] = [];
  noCity: boolean=false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  AddressFormGroup: FormGroup;
  
  @Output() addressForm = new EventEmitter();
  

  @Select(MetaDataState.filteredCities)
  filteredCities$: Observable<string[]>;

  constructor(private formBuilder: FormBuilder,
    public filterCityService: CityFilterService, 
    public store: Store,
    private providerActivititesService: ProviderActivitiesService) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl(''), 
      buildingNumber: new FormControl(''),
      city:new FormControl('')
    });
   }

  ngOnInit(): void {
    this.passFormController();
    this.filterCityService.fetchCities()
      .subscribe((data)=>{
        this.cities=data;
    })
    
    this.onInit();
  }
  
  passFormController():void {
    this.addressForm.emit(this.AddressFormGroup);
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
    this.AddressFormGroup.get('cityControl').valueChanges
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

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SelectCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit {

  constructor(private store: Store ) {}

  ngOnInit(): void {
  }
  onSelectedCity(event):void{
    this.store.dispatch(new SelectCity(event))
  }

}

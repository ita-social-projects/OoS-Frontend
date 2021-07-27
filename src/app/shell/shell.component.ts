import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { Coords } from '../shared/models/coords.model';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
import { SetCity } from '../shared/store/filter.actions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor( 
    private geolocationService: GeolocationService,
    private store:Store
    ) { }

  ngOnInit(): void {
    this.geolocationService.handleUserLocation((coords: Coords)=> {
      // to do geo proposition if user allow 
      // waiting for endpoint 
      this.store.dispatch(new SetCity({
        district: " ",
        id: 34446,
        longitude: coords.lng,
        latitude: coords.lat,  
        name: "ВАШЕ МІСТО",
        region: " "
      }))
    })
  }

}

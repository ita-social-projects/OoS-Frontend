import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { Coords } from '../shared/models/coords.model';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
import { GetFilteredWorkshops, SetCity } from '../shared/store/filter.actions';
import { RegistrationState } from '../shared/store/registration.state';
import { GetFavoriteWorkshops } from '../shared/store/user.actions';

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
      //TODO: waiting for endpoint 
      coords && this.store.dispatch(new SetCity({
        district: " ",
        id: 34446,
        longitude: coords.lng,
        latitude: coords.lat,  
        name: "ВАШЕ МІСТО",
        region: " "
      }))
    })
    this.store.dispatch(new GetFilteredWorkshops());
    this.store.selectSnapshot(RegistrationState.isAuthorized) && this.store.dispatch(new GetFavoriteWorkshops());
  }

}

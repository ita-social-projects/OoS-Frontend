import { Component, OnInit } from '@angular/core';
import { Coords } from '../shared/models/coords.model';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor( private geolocationService: GeolocationService) { }

  ngOnInit(): void {
    this.geolocationService.handleUserLocation((coords: Coords)=> {})
  }

}

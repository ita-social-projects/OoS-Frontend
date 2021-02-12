import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { latLng, tileLayer, icon, marker, polyline } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  testMarker1 = marker([ 50.408333, 30.556072 ], {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  });

  testMarker2 = marker([ 50.484972, 30.586922 ], {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  });

  // You can make path from testMarker2 to testMarker1
  route = polyline([]);

  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: {
      'Mt. Rainier testMarker1': this.testMarker1,
      'Mt. Rainier testMarker2 Start': this.testMarker2,
      'Mt. Rainier Climb Route': this.route
    }
  };
  options = {
    layers: [ this.streetMaps, this.route, this.testMarker1, this.testMarker2 ],
    zoom: 11,
    center: latLng([ 50.462235, 30.545131 ])
  };
  stateMarkers: Observable<Object[]>;
  public markers: Array<Object> = [];

  constructor(private store: Store) { 
    this.stateMarkers = this.store.select(state => state.ShowData);
    // To do: change "state.ShowData" when state will be configured
  }

  ngOnInit(): void {
    this.stateMarkers.subscribe((data) => this.markers = data);
  }

}

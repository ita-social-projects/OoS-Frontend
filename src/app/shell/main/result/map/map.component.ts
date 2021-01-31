import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
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

import { Component, OnInit } from '@angular/core';
import { GeolocationService } from './geolocation.service';
import { Store } from '@ngxs/store';
import { SetLocation } from '../shared/store/user.actions';
import { UserStateModel } from '../shared/store/user.state';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor(public geolocationService: GeolocationService, public store: Store) { }

  ngOnInit(): void {
    this.geolocationService.handleUserLocation((location) => this.store.dispatch(new SetLocation(location)));
  }

}
import { Observable, Subject } from 'rxjs';
import { GetFavoriteWorkshopsByUserId } from './../shared/store/user.actions';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Coords } from '../shared/models/coords.model';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
import { RegistrationState } from '../shared/store/registration.state';
import { GetFavoriteWorkshops } from '../shared/store/user.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private geolocationService: GeolocationService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.geolocationService.handleUserLocation((coords: Coords) => {
      coords && this.geolocationService.locationDecode(coords, (result) => {
        this.geolocationService.confirmCity({
          district: '',
          longitude: coords.lng,
          latitude: coords.lat,
          name: result.address.city || result.address.town || result.address.village || result.address.hamlet,
          region: ''
        }, false);
      });
    });

    this.isParent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((parent) => {
        !!parent && this.store.dispatch([
          new GetFavoriteWorkshops(),
          new GetFavoriteWorkshopsByUserId()
        ]);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

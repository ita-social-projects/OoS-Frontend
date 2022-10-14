import { Codeficator } from './../shared/models/codeficator.model';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Coords } from '../shared/models/coords.model';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
import { RegistrationState } from '../shared/store/registration.state';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../shared/enum/role';
import { GetFavoriteWorkshops, GetFavoriteWorkshopsByUserId } from '../shared/store/parent.actions';
import { ConfirmCity, SetCity } from '../shared/store/filter.actions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
    role$: Observable<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private geolocationService: GeolocationService, private store: Store) {}

  ngOnInit(): void {
    if (this.geolocationService.isCityInStorage()) {
      this.geolocationService.confirmCity(JSON.parse(localStorage.getItem('cityConfirmation')));
    } else {
      this.geolocationService.handleUserLocation((coords: Coords) => {
        coords &&
          this.geolocationService.getNearestByCoordinates(coords, (result: Codeficator) => {
            this.store.dispatch([new SetCity(result, false), new ConfirmCity(false)]);
          });
      });
    }
    

    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: string) => {
      role == Role.parent && this.store.dispatch([new GetFavoriteWorkshops(), new GetFavoriteWorkshopsByUserId()]);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

import { Util } from 'src/app/shared/utils/utils';
import { Constants } from './../../shared/constants/constants';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { GetTopDirections } from 'src/app/shared/store/meta-data.actions';
import { filter, takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/shared/store/user.state';
import { Favorite } from 'src/app/shared/models/favorite.model';
import { City } from 'src/app/shared/models/city.model';
import { Role } from 'src/app/shared/enum/role';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit, OnDestroy {
  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.city)
  city$: Observable<City>;
  @Select(MetaDataState.topDirections)
  topDirections$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;
  Role = Role;

  constructor(private store: Store) { }

  getTopWorkshops(role: string): void {
    if (role === Role.parent) {
      combineLatest([this.city$, this.favoriteWorkshops$])
        .pipe(
          filter(([city, favorit]) => (!!city && !!favorit?.length) || (favorit === null)),
          takeUntil(this.destroy$))
        .subscribe(() => this.store.dispatch(new GetTopWorkshops(Constants.ITEMS_PER_PAGE)));
    }
    else {
      this.city$
        .pipe(
          filter(city => !!city),
          takeUntil(this.destroy$))
        .subscribe(() => this.store.dispatch(new GetTopWorkshops(Constants.ITEMS_PER_PAGE)));
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new GetTopDirections());

    this.role$
      .pipe(
        filter(role => !!role),
        takeUntil(this.destroy$))
      .subscribe(role => this.getTopWorkshops(role))
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

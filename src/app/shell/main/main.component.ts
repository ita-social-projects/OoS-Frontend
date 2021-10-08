import { City } from './../../shared/models/city.model';
import { Favorite } from './../../shared/models/favorite.model';
import { UserState } from './../../shared/store/user.state';
import { Role } from 'src/app/shared/enum/role';
import { Util } from 'src/app/shared/utils/utils';
import { Constants } from './../../shared/constants/constants';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { GetTopDirections } from 'src/app/shared/store/meta-data.actions';
import { takeUntil, filter } from 'rxjs/operators';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit {
  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.city)
  city$: Observable<City>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;
  @Select(MetaDataState.topDirections)
  topDirections$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  public parent: boolean;

  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;

  constructor(private store: Store) { }
  
  getTopWorkshops(role: string): void {
    if(role === Role.parent) {
      combineLatest([this.city$, this.favoriteWorkshops$])
      .pipe(
        filter((result) => {
          if(!!result[0] && !!result[1]?.length) {
            return true;
          }
          else if(result[1] === null) {
            return true;
          }
        }),
        takeUntil(this.destroy$))
      .subscribe(()=> this.store.dispatch(new GetTopWorkshops(Constants.ITEMS_PER_PAGE)));
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

    this.isParent$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);

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

import { City } from './../../shared/models/city.model';
import { Favorite } from './../../shared/models/favorite.model';
import { UserState } from './../../shared/store/user.state';
import { Role } from 'src/app/shared/enum/role';
import { Constants } from './../../shared/constants/constants';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Workshop, WorkshopCard } from '../../shared/models/workshop.model';
import { GetTopDirections } from 'src/app/shared/store/meta-data.actions';
import { takeUntil, map, filter } from 'rxjs/operators';


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
  @ViewChild('WorkshopsWrap') WorkshopsWrap: ElementRef;
  public parent: boolean;


  constructor(private store: Store) { }
  
  getTopWorkshops(role: string): void {
    if(role === Role.parent) {
      combineLatest([this.city$, this.favoriteWorkshops$])
      .pipe(
        filter(result => !!result[0] && !!result[1].length),
        takeUntil(this.destroy$))
      .subscribe(()=> this.store.dispatch(new GetTopWorkshops(Constants.WORKSHOPS_PER_PAGE)));
    }
    else {
      this.city$
      .pipe(
        filter(city=> !!city),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetTopWorkshops(Constants.WORKSHOPS_PER_PAGE)));
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

  emptyWorkshops(): Array<Workshop> {
    let amountCardsInRow = 0;
    let workshops = [];
    let amountWorkshops = 0;
    this.topWorkshops$.pipe(map(x => workshops.push(x))).subscribe();
    if (workshops[0]) {
      amountWorkshops = workshops[0].length;
    }
    if (this.WorkshopsWrap) {
      amountCardsInRow = Math.floor(Number((this.WorkshopsWrap.nativeElement.clientWidth) / 352));
    }
    let emptyWorkshops = (amountCardsInRow - amountWorkshops % amountCardsInRow) !== amountCardsInRow ? (amountCardsInRow - amountWorkshops % amountCardsInRow) : 0;
    return new Array(emptyWorkshops | 0);
  }
}

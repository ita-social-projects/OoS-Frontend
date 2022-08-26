import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { filter, takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/shared/store/user.state';
import { Favorite } from 'src/app/shared/models/favorite.model';
import { Role } from 'src/app/shared/enum/role';
import { Login } from 'src/app/shared/store/registration.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { Codeficator } from 'src/app/shared/models/codeficator.model';
import { MainPageState } from 'src/app/shared/store/main-page.state';
import { GetTopDirections, GetTopWorkshops } from 'src/app/shared/store/main-page.actions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  Role = Role;

  @Select(MainPageState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  topWorkshops: WorkshopCard[];

  @Select(MainPageState.topDirections)
  topDirections$: Observable<Direction[]>;
  topDirections: Direction[];

  @Select(MainPageState.isLoadingData)
  isLoadingData$: Observable<boolean>;
  isLoadingData: boolean;

  @Select(RegistrationState.role)
  role$: Observable<Role>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  isMobile: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetTopDirections());

    this.role$
      .pipe(
        filter(role => !!role),
        takeUntil(this.destroy$)
      )
      .subscribe((role: Role) => this.getTopWorkshops(role));

    this.isMobileScreen$.pipe(takeUntil(this.destroy$)).subscribe((isMobile: boolean) => (this.isMobile = isMobile));
  }

  getTopWorkshops(role: Role): void {
    if (role === Role.parent) {
      combineLatest([this.settlement$, this.favoriteWorkshops$])
        .pipe(
          filter(([city, favorite]) => (!!city && !!favorite?.length) || favorite === null),
          takeUntil(this.destroy$)
        )
        .subscribe(([city, favorite]: [Codeficator, Favorite[]]) => this.store.dispatch(new GetTopWorkshops(city)));
    } else {
      this.settlement$
        .pipe(
          filter(city => !!city),
          takeUntil(this.destroy$)
        )
        .subscribe((city: Codeficator) => this.store.dispatch(new GetTopWorkshops(city)));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  register(): void {
    this.store.dispatch(new Login(true));
  }
}

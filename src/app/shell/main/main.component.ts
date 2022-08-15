import { CodeficatorFilter } from './../../shared/models/codeficator.model';
import { PaginationConstants } from './../../shared/constants/constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { FilterClear, GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { WorkshopCard } from '../../shared/models/workshop.model';
import { GetTopDirections } from 'src/app/shared/store/meta-data.actions';
import { filter, takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/shared/store/user.state';
import { Favorite } from 'src/app/shared/models/favorite.model';
import { Role } from 'src/app/shared/enum/role';
import { Login } from 'src/app/shared/store/registration.actions';
import { AppState } from 'src/app/shared/store/app.state';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit, OnDestroy {
  Role = Role;

  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.settelment)
  settelment$: Observable<CodeficatorFilter>;
  @Select(MetaDataState.topDirections)
  topDirections$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingMetaData$: Observable<boolean>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  isMobile:boolean;
  constructor(private store: Store) { }

  getTopWorkshops(role: string): void {
    if (role === Role.parent) {
      combineLatest([this.settelment$, this.favoriteWorkshops$])
        .pipe(
          filter(([city, favorite]) => (!!city && !!favorite?.length) || (favorite === null)),
          takeUntil(this.destroy$))
        .subscribe(() => this.store.dispatch(new GetTopWorkshops(PaginationConstants.ITEMS_PER_PAGE_DEFAULT)));
    }
    else {
      this.settelment$
        .pipe(
          filter(city => !!city),
          takeUntil(this.destroy$))
        .subscribe(() => this.store.dispatch(new GetTopWorkshops(PaginationConstants.ITEMS_PER_PAGE_DEFAULT)));
    }
  }

  ngOnInit(): void {

    this.store.dispatch([new GetTopDirections(), new FilterClear()]);

    this.role$
      .pipe(
        filter(role => !!role),
        takeUntil(this.destroy$))
      .subscribe(role => this.getTopWorkshops(role));

    this.isMobileScreen$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMobile) => this.isMobile = isMobile);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  register(): void {
    this.store.dispatch(new Login(true));
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { DirectionsStatistic } from 'src/app/shared/models/category.model';
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
  topDirections$: Observable<DirectionsStatistic[]>;
  topDirections: DirectionsStatistic[];
  @Select(MainPageState.isLoadingData)
  isLoadingData$: Observable<boolean>;
  isLoadingData: boolean;
  @Select(RegistrationState.role)
  role$: Observable<Role>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  settlement: Codeficator;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  isMobile: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    combineLatest([this.role$, this.settlement$])
      .pipe(
        filter(([role, settlement]: [Role, Codeficator]) => !!(role && settlement)),
        takeUntil(this.destroy$)
      )
      .subscribe(([role, settlement]: [Role, Codeficator]) => {
        this.settlement = settlement;
        this.getData(role);
      });

    this.isMobileScreen$.pipe(takeUntil(this.destroy$)).subscribe((isMobile: boolean) => (this.isMobile = isMobile));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onRegister(): void {
    this.store.dispatch(new Login(true));
  }

  private getData(role: Role): void {
    if (role === Role.parent) {
      this.favoriteWorkshops$
        .pipe(
          filter((favorite: Favorite[]) => !!favorite?.length || favorite === null),
          takeUntil(this.destroy$)
        )
        .subscribe((favorite: Favorite[]) => this.getMainPageData());
    } else {
      this.getMainPageData();
    }
  }

  private getMainPageData(): void {
    this.store.dispatch([new GetTopWorkshops(), new GetTopDirections()]);
  }
}

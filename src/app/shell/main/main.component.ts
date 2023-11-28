import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { RegistrationState } from 'shared/store/registration.state';
import { WorkshopCard } from 'shared/models/workshop.model';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Direction } from 'shared/models/category.model';
import { Role } from 'shared/enum/role';
import { Codeficator } from 'shared/models/codeficator.model';
import { Favorite } from 'shared/models/favorite.model';
import { AppState } from 'shared/store/app.state';
import { FilterState } from 'shared/store/filter.state';
import { GetTopWorkshops, GetTopDirections } from 'shared/store/main-page.actions';
import { MainPageState } from 'shared/store/main-page.state';
import { ParentState } from 'shared/store/parent.state';
import { Login } from 'shared/store/registration.actions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
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
  @Select(ParentState.favoriteWorkshops)
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
          take(1),
          filter((favorite: Favorite[]) => !!favorite?.length || favorite === null)
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

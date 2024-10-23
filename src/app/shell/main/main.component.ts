import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { Direction } from 'shared/models/category.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { Favorite } from 'shared/models/favorite.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { AppState } from 'shared/store/app.state';
import { FilterState } from 'shared/store/filter.state';
import { GetTopDirections, GetTopWorkshops } from 'shared/store/main-page.actions';
import { MainPageState } from 'shared/store/main-page.state';
import { ParentState } from 'shared/store/parent.state';
import { Login } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  @Select(MainPageState.topWorkshops)
  public topWorkshops$: Observable<WorkshopCard[]>;
  @Select(MainPageState.topDirections)
  public topDirections$: Observable<Direction[]>;
  @Select(MainPageState.isLoadingData)
  public isLoadingData$: Observable<boolean>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(ParentState.favoriteWorkshops)
  public favoriteWorkshops$: Observable<Favorite[]>;
  @Select(FilterState.settlement)
  public settlement$: Observable<Codeficator>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  public readonly Role = Role;

  public topWorkshops: WorkshopCard[];
  public topDirections: Direction[];
  public isLoadingData: boolean;
  public settlement: Codeficator;
  public isMobile: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
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

  public onRegister(): void {
    this.store.dispatch(new Login(true));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

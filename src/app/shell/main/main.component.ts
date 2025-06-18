import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, asyncScheduler } from 'rxjs';
import { filter, take, takeUntil, map } from 'rxjs/operators';

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
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { MatDialog } from '@angular/material/dialog';
import { GetUnfinishedWorkshop, OnDeleteUnfinishedWorkshop, SetDraftModalShown } from 'shared/store/provider.actions';
import { Router } from '@angular/router';
import { ProviderState } from 'shared/store/provider.state';

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
  @Select(ProviderState.hasUnfinishedWorkshopData)
  public hasUnfinishedWorkshopData$: Observable<boolean>;
  @Select(ProviderState.isModalShown)
  public isModalShown$: Observable<boolean>;
  public topDirectionsLimited$: Observable<Direction[]>;
  public topWorkshopsLimited$: Observable<WorkshopCard[]>;

  public readonly Role = Role;

  public topWorkshops: WorkshopCard[];
  public topDirections: Direction[];
  public isLoadingData: boolean;
  public settlement: Codeficator;
  public isMobile: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.topDirectionsLimited$ = this.topDirections$.pipe(map((directions) => directions?.slice(0, 6)));
    this.topWorkshopsLimited$ = this.topWorkshops$.pipe(map((workshops) => workshops?.slice(0, 4)));

    combineLatest([this.role$, this.settlement$])
      .pipe(
        filter(([role, settlement]: [Role, Codeficator]) => !!(role && settlement)),
        takeUntil(this.destroy$)
      )
      .subscribe(([role, settlement]: [Role, Codeficator]) => {
        this.settlement = settlement;
        this.getData(role);
      });

    combineLatest([this.hasUnfinishedWorkshopData$, this.isModalShown$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([hasDraftData, isModalShown]) => hasDraftData && !isModalShown)
      )
      .subscribe(() => {
        this.showDialog();
      });

    this.isMobileScreen$.pipe(takeUntil(this.destroy$)).subscribe((isMobile: boolean) => (this.isMobile = isMobile));
  }

  public onRegister(): void {
    this.store.dispatch(new Login(false));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public continueUnfinishedCreation(): void {
    this.router.navigate(['/create', 'unfinished']);
  }

  public cancelUnfinishedCreation(): void {
    this.store.dispatch(new OnDeleteUnfinishedWorkshop());
  }

  public showDialog(): void {
    asyncScheduler.schedule(() => {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.incompleteWorkshop,
            showCloseButton: true
          }
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.continueUnfinishedCreation();
          } else if (result === false) {
            this.cancelUnfinishedCreation();
          }
          this.store.dispatch(new SetDraftModalShown(true));
        });
    }, 2000);
  }

  private getData(role: Role): void {
    if (role === Role.parent) {
      this.favoriteWorkshops$
        .pipe(
          take(1),
          filter((favorite: Favorite[]) => !!favorite?.length || favorite === null)
        )
        .subscribe(() => this.getMainPageData());

      return;
    } else if (role === Role.provider) {
      this.store.dispatch(new GetUnfinishedWorkshop());
    }
    this.getMainPageData();
  }

  private getMainPageData(): void {
    this.store.dispatch([new GetTopWorkshops(), new GetTopDirections()]);
  }
}

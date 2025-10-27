import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, combineLatest, Observable, Subject, withLatestFrom } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

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
import {
  GetUnfinishedCompetition,
  GetUnfinishedWorkshop,
  OnDeleteUnfinishedCompetition,
  OnDeleteUnfinishedWorkshop,
  SetUnfinishedModalShown
} from 'shared/store/provider.actions';
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
  @Select(ProviderState.fetchedUnfinishedWorkshop)
  public fetchedWorkshop$: Observable<boolean>;
  @Select(ProviderState.fetchedUnfinishedCompetition)
  public fetchedCompetition$: Observable<boolean>;
  @Select(ProviderState.hasUnfinishedWorkshopData)
  public hasUnfinishedWorkshopData$: Observable<boolean>;
  @Select(ProviderState.hasUnfinishedCompetitionData)
  public hasUnfinishedCompetitionData$: Observable<boolean>;
  @Select(ProviderState.isModalShown)
  public isModalShown$: Observable<boolean>;
  public topDirectionsLimited$: Observable<Direction[]>;
  public topWorkshopsLimited$: Observable<WorkshopCard[]>;

  public readonly Role = Role;

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

    combineLatest([this.fetchedWorkshop$, this.fetchedCompetition$, this.isModalShown$])
      .pipe(
        filter(([fetchedWorkshop, fetchedCompetition, modalShown]) => fetchedWorkshop && fetchedCompetition && !modalShown),
        withLatestFrom(this.hasUnfinishedWorkshopData$, this.hasUnfinishedCompetitionData$),
        map(([[fetchedWorkshop, fetchedCompetition, modalShown], hasWorkshop, hasCompetition]) => {
          if (hasWorkshop && hasCompetition) {
            return ModalConfirmationType.incompleteWorkshopAndCompetition;
          }
          if (hasWorkshop) {
            return ModalConfirmationType.incompleteWorkshop;
          }
          if (hasCompetition) {
            return ModalConfirmationType.incompleteCompetition;
          }
          return null;
        }),
        filter(Boolean),
        take(1)
      )
      .subscribe((type) => {
        this.store.dispatch(new SetUnfinishedModalShown(true));
        this.showDialog(type);
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

  public continueUnfinishedCreation(entity: 'workshop' | 'competition'): void {
    this.router.navigate([`/create/${entity}`, 'unfinished']);
  }

  public cancelUnfinishedCreation(entity: 'workshop' | 'competition' | 'both'): void {
    if (entity === 'workshop') {
      this.store.dispatch(new OnDeleteUnfinishedWorkshop());
    } else if (entity === 'competition') {
      this.store.dispatch(new OnDeleteUnfinishedCompetition());
    } else {
      this.store.dispatch(new OnDeleteUnfinishedWorkshop());
      this.store.dispatch(new OnDeleteUnfinishedCompetition());
    }
  }

  public showDialog(type: ModalConfirmationType): void {
    const incompleteCompetition = type === ModalConfirmationType.incompleteCompetition;
    const incompleteBoth = type === ModalConfirmationType.incompleteWorkshopAndCompetition;
    asyncScheduler.schedule(() => {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          data: {
            type,
            showCloseButton: true
          },
          maxWidth: incompleteBoth ? Constants.MODAL_MEDIUM : Constants.MODAL_SMALL
        })
        .afterClosed()
        .subscribe((result: boolean | string) => {
          const isWorkshop = (result === true && !incompleteCompetition) || (result === true && incompleteBoth);
          const isCompetition = (result === 'secondOption' && incompleteBoth) || (result === true && incompleteCompetition);

          if (isWorkshop) {
            this.continueUnfinishedCreation('workshop');
          } else if (isCompetition) {
            this.continueUnfinishedCreation('competition');
          } else if (!result) {
            const target = incompleteBoth ? null : incompleteCompetition ? 'competition' : 'workshop';

            if (target) {
              this.cancelUnfinishedCreation(target);
            }
          }
          this.store.dispatch(new SetUnfinishedModalShown(true));
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
      this.store.dispatch([new GetUnfinishedWorkshop(), new GetUnfinishedCompetition()]);
    }
    this.getMainPageData();
  }

  private getMainPageData(): void {
    this.store.dispatch([new GetTopWorkshops(), new GetTopDirections()]);
  }
}

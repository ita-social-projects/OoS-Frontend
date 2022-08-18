import { Select, Store } from '@ngxs/store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Login } from 'src/app/shared/store/registration.actions';
import { Role } from 'src/app/shared/enum/role';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WorkshopCardDialog } from 'src/app/shared/components/workshop-card/workshop-card.component';
import { Favorite } from 'src/app/shared/models/favorite.model';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from 'src/app/shared/store/user.actions';
import { ShowMessageBar } from 'src/app/shared/store/app.actions';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/shared/store/user.state';
import { AppState } from 'src/app/shared/store/app.state';
import { PayRateTypeUkr } from 'src/app/shared/enum/enumUA/workshop';
import { WorkhopStatus } from 'src/app/shared/enum/workshop';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;
  readonly PayRateTypeUkr = PayRateTypeUkr;
  readonly workhopStatus = WorkhopStatus;

  public favoriteWorkshop: Favorite;
  public isFavorite: boolean;

  @Input() workshop: Workshop;
  @Input() role: string;

  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => this.role = role);

    combineLatest([this.favoriteWorkshops$, this.route.params])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([favorites, params]) => {
        this.favoriteWorkshop = favorites?.find(item => item.workshopId === params.id);
        this.isFavorite = !!this.favoriteWorkshop;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onOpenDialog(): void {
    this.dialog.open(WorkshopCardDialog);
  }

  onLike(): void {
    const param = new Favorite(
      this.route.snapshot.paramMap.get('id'),
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
    );
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({ message: `Гурток ${this.workshop.title} додано до Улюблених`, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onDisLike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshop.id),
      new ShowMessageBar({ message: `Гурток ${this.workshop.title} видалено з Улюблених`, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  login(): void {
    !(this.role !== Role.unauthorized) && this.store.dispatch(new Login(false));
  }
}

import { ParentState } from './../../../../shared/store/parent.state.';
import { Select, Store } from '@ngxs/store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { WorkshopCardDialog } from '../../../../shared/components/workshop-card/workshop-card.component';
import { PayRateTypeUkr } from '../../../../shared/enum/enumUA/workshop';
import { Role } from '../../../../shared/enum/role';
import { WorkshopOpenStatus } from '../../../../shared/enum/workshop';
import { Favorite } from '../../../../shared/models/favorite.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { ShowMessageBar } from '../../../../shared/store/app.actions';
import { AppState } from '../../../../shared/store/app.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from '../../../../shared/store/parent.actions';
import { Login } from '../../../../shared/store/registration.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { messageText } from 'src/app/shared/enum/messageBar';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;
  readonly PayRateTypeUkr = PayRateTypeUkr;
  readonly workhopStatus = WorkshopOpenStatus;

  public favoriteWorkshop: Favorite;
  public isFavorite: boolean;
  public hideApplicationSubmission: boolean;

  @Input() workshop: Workshop;
  @Input() role: string;

  @Select(RegistrationState.role)
    role$: Observable<string>;
  @Select(ParentState.favoriteWorkshops)
    favoriteWorkshops$: Observable<Favorite[]>;
  @Select(AppState.isMobileScreen)
    isMobileScreen$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.hideApplicationSubmission = this.workshop.status === this.workhopStatus.Closed;
    this.role$.pipe(takeUntil(this.destroy$)).subscribe(role => (this.role = role));

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
      new ShowMessageBar({ message: messageText.addedWorkshopFavorite, type: 'success' }),
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onDisLike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshop.id),
      new ShowMessageBar({ message: messageText.deleteWorkshopFavorite, type: 'success' }),
    ]);
    this.isFavorite = !this.isFavorite;
  }

  login(): void {
    !(this.role !== Role.unauthorized) && this.store.dispatch(new Login(false));
  }
}

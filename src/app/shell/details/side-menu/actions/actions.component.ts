import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UnregisteredUserWarningModalComponent } from 'shared/components/unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { ModeConstants } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationDescription } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { WorkshopOpenStatus } from 'shared/enum/workshop';
import { Favorite } from 'shared/models/favorite.model';
import { Workshop } from 'shared/models/workshop.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  private readonly workshopStatus = WorkshopOpenStatus;
  public readonly ModalTypeAction = ModalConfirmationDescription;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly ModeConstants = ModeConstants;
  public readonly Role = Role;

  public favoriteWorkshop: Favorite;
  public isFavorite: boolean;
  public hideApplicationSubmission: boolean;

  @Input()
  public workshop: Workshop;
  @Input()
  public role: string;

  @Select(RegistrationState.role)
  private role$: Observable<string>;
  @Select(ParentState.favoriteWorkshops)
  private favoriteWorkshops$: Observable<Favorite[]>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, public dialog: MatDialog, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.hideApplicationSubmission = this.workshop.status === this.workshopStatus.Closed;
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role) => (this.role = role));

    combineLatest([this.favoriteWorkshops$, this.route.params])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([favorites, params]) => {
        this.favoriteWorkshop = favorites?.find((item) => item.workshopId === params.id);
        this.isFavorite = !!this.favoriteWorkshop;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onOpenDialog(type: ModalConfirmationDescription): void {
    if (this.role === Role.unauthorized) {
      this.dialog.open(UnregisteredUserWarningModalComponent, {
        autoFocus: false,
        restoreFocus: false,
        data: {
          message: type
        }
      });
    }
  }

  public onDislike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshop.id),
      new ShowMessageBar({ message: SnackbarText.deleteWorkshopFavorite, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  public onLike(): void {
    const param = new Favorite(
      this.route.snapshot.paramMap.get('id'),
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
    );
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({ message: SnackbarText.addedWorkshopFavorite, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }
}

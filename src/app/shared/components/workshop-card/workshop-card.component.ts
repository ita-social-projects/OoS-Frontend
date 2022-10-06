import { ProviderWorkshopCard } from './../../models/workshop.model';
import { OwnershipTypeName } from './../../enum/provider';
import { Favorite } from './../../models/favorite.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Role } from '../../enum/role';
import { WorkshopCard } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { ShowMessageBar } from '../../store/app.actions';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from '../../constants/constants';
import { ImagesService } from '../../services/images/images.service';
import { CategoryIcons } from '../../enum/category-icons';
import { PayRateTypeUkr, RecruitmentStatusUkr } from '../../enum/enumUA/workshop';
import { ConfirmationModalWindowComponent } from '../confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from '../../enum/modal-confirmation';
import { WorkshopOpenStatus } from '../../enum/workshop';
import { OwnershipTypeUkr } from '../../enum/enumUA/provider';
import { UpdateWorkshopStatus } from '../../store/provider.actions';
import { DeleteFavoriteWorkshop, CreateFavoriteWorkshop } from '../../store/parent.actions';
import { ParentState } from '../../store/parent.state.';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss'],
})
export class WorkshopCardComponent implements OnInit, OnDestroy {
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly Role = Role;
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  readonly categoryIcons = CategoryIcons;
  readonly PayRateTypeUkr = PayRateTypeUkr;
  readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  readonly workhopStatus = WorkshopOpenStatus;
  readonly recruitmentStatusUkr = RecruitmentStatusUkr;
  readonly modalConfirmationType = ModalConfirmationType;

  isFavorite = false;
  canChangeWorkshopStatus: boolean;
  workshopData: ProviderWorkshopCard | WorkshopCard;

  @Input() set workshop(workshop: WorkshopCard) {
    this.workshopData = workshop;
    this.imagesService.setWorkshopCoverImage(workshop);
  }
  @Input() isCabinetView = false;
  @Input() isHorizontalView = false;
  @Input() isCreateFormView = false;

  @Output() deleteWorkshop = new EventEmitter<WorkshopCard | ProviderWorkshopCard>();

  @Select(ParentState.favoriteWorkshops)
    favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
    role$: Observable<Role>;
  role: Role;
  destroy$: Subject<boolean> = new Subject<boolean>();

  private favoriteWorkshopId: string;

  constructor(private store: Store, private dialog: MatDialog, private imagesService: ImagesService) {}

  ngOnInit(): void {
    if (this.isCabinetView) {
      this.canChangeWorkshopStatus = !(
        this.workshopData.providerOwnership === OwnershipTypeName.State ||
        (this.workshopData as ProviderWorkshopCard).availableSeats === this.UNLIMITED_SEATS
      );
    }

    this.role$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter((role: Role) => role === Role.parent))
      .subscribe((role: Role) => {
        this.getFavoriteWorkshops();
        this.role = role;
      });
  }

  onDelete(): void {
    this.deleteWorkshop.emit(this.workshopData);
  }

  onLike(): void {
    const param = new Favorite(
      this.workshopData.workshopId,
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
    );
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({ message: `Гурток ${this.workshopData.title} додано до Улюблених`, type: 'success' }),
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onDisLike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshopId),
      new ShowMessageBar({ message: `Гурток ${this.workshopData.title} видалено з Улюблених`, type: 'success' }),
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onChangeWorkshopStatus(status: string, type: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: type,
      },
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.store.dispatch(
          new UpdateWorkshopStatus(
            { workshopId: this.workshopData.workshopId, status: status },
            this.workshopData.providerId
          )
        );
      }
    });
  }

  onOpenDialog(): void {
    this.dialog.open(WorkshopCardDialog);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getFavoriteWorkshops(): void {
    this.favoriteWorkshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((favorites: Favorite[]) => !!favorites)
      )
      .subscribe((favorites: Favorite[]) => {
        const favorite = favorites.find((item: Favorite) => item.workshopId === this.workshopData.workshopId);
        if (!!favorite) {
          this.favoriteWorkshopId = favorite.id;
          this.isFavorite = true;
        }
      });
  }
}

@Component({
  selector: 'app-workshop-dialog',
  template: ` <div mat-dialog-content fxLayoutAlign="center" class="dialog-title">
      <p>Для того щоб додати в улюблені будь ласка зареєструйтеся на порталі. Дякуємо</p>
    </div>
    <div mat-dialog-actions fxLayoutAlign="center">
      <button mat-raised-button mat-dialog-close class="dialog-action-button">Повернутись</button>
    </div>`,
  styleUrls: ['./workshop-card.component.scss'],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class WorkshopCardDialog {}

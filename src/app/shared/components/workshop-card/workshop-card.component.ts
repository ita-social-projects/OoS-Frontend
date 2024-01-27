import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ParentState } from 'shared-store/parent.state';
import { WorkshopSeatsLackModalComponent } from 'shared/components/workshop-card/workshop-seats-lack-modal/workshop-seats-lack-modal.component';
import { Constants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { FormOfLearningEnum, PayRateTypeEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationDescription, ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { OwnershipTypes } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { WorkshopOpenStatus } from 'shared/enum/workshop';
import { Favorite } from 'shared/models/favorite.model';
import { WorkshopBaseCard, WorkshopProviderViewCard } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { ShowMessageBar } from 'shared/store/app.actions';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from 'shared/store/parent.actions';
import { UpdateWorkshopStatus } from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { ConfirmationModalWindowComponent } from '../confirmation-modal-window/confirmation-modal-window.component';
import { UnregisteredUserWarningModalComponent } from '../unregistered-user-warning-modal/unregistered-user-warning-modal.component';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {
  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly Role = Role;
  public readonly tooltipPositionAbove = Constants.MAT_TOOL_TIP_POSITION_ABOVE;
  public readonly tooltipPositionBelow = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly categoryIcons = CategoryIcons;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  public readonly workshopStatus = WorkshopOpenStatus;
  public readonly modalConfirmationType = ModalConfirmationType;

  public isFavorite = false;
  public canChangeWorkshopStatus: boolean;
  public workshopData: WorkshopBaseCard;

  @Input()
  public set workshop(workshop: WorkshopBaseCard) {
    this.workshopData = workshop;
    this.imagesService.setWorkshopCoverImage(workshop);
  }

  @Input() public isCabinetView = false;
  @Input() public isHorizontalView = false;
  @Input() public isCreateFormView = false;

  @Output() public deleteWorkshop = new EventEmitter<WorkshopBaseCard>();

  @Select(ParentState.favoriteWorkshops)
  public favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  private favoriteWorkshopId: string;

  public get canOpenWorkshopRecruitment(): boolean {
    return (this.workshopData as WorkshopProviderViewCard).takenSeats < (this.workshopData as WorkshopProviderViewCard).availableSeats;
  }

  constructor(private store: Store, private dialog: MatDialog, private imagesService: ImagesService) {}

  public ngOnInit(): void {
    if (this.isCabinetView) {
      this.canChangeWorkshopStatus = !(
        this.workshopData.providerOwnership === OwnershipTypes.State ||
        (this.workshopData as WorkshopProviderViewCard).availableSeats === this.UNLIMITED_SEATS
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

  public onDelete(): void {
    this.deleteWorkshop.emit(this.workshopData);
  }

  public onLike(): void {
    const param = new Favorite(this.workshopData.workshopId, this.store.selectSnapshot(RegistrationState.parent).userId.toString());
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({
        message: SnackbarText.addedWorkshopFavorite,
        type: 'success'
      })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  public onDisLike(): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(this.favoriteWorkshopId),
      new ShowMessageBar({
        message: SnackbarText.deleteWorkshopFavorite,
        type: 'success'
      })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  public onChangeWorkshopStatus(status: string, type: ModalConfirmationType): void {
    if ((this.canOpenWorkshopRecruitment && type === ModalConfirmationType.openSet) || type === ModalConfirmationType.closeSet) {
      const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: type
        }
      });

      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.store.dispatch(
            new UpdateWorkshopStatus({ workshopId: this.workshopData.workshopId, status: status }, this.workshopData.providerId)
          );
        }
      });
    } else {
      this.dialog.open(WorkshopSeatsLackModalComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          workshopId: this.workshopData.workshopId,
          workshopTitle: this.workshopData.title
        }
      });
    }
  }

  public onOpenDialog(): void {
    this.dialog.open(UnregisteredUserWarningModalComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        message: ModalConfirmationDescription.unregisteredFavoriteWarning
      }
    });
  }

  public ngOnDestroy(): void {
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

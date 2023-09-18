import { ProviderWorkshopCard } from '../../models/workshop.model';
import { Favorite } from '../../models/favorite.model';
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
import { PayRateTypeEnum, RecruitmentStatusEnum } from '../../enum/enumUA/workshop';
import { ConfirmationModalWindowComponent } from '../confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationDescription, ModalConfirmationType } from '../../enum/modal-confirmation';
import { WorkshopOpenStatus } from '../../enum/workshop';
import { OwnershipTypesEnum } from '../../enum/enumUA/provider';
import { UpdateWorkshopStatus } from '../../store/provider.actions';
import { DeleteFavoriteWorkshop, CreateFavoriteWorkshop } from '../../store/parent.actions';
import { ParentState } from 'shared-store/parent.state';
import {UnregisteredUserWarningModalComponent} from '../unregistered-user-warning-modal/unregistered-user-warning-modal.component';
import { OwnershipTypes } from '../../enum/provider';
import { SnackbarText } from '../../enum/enumUA/messageBer';
import {
  WorkshopSeatsLackModalComponent
} from 'shared/components/workshop-card/workshop-seats-lack-modal/workshop-seats-lack-modal.component';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {
  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly Role = Role;
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly categoryIcons = CategoryIcons;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  public readonly workhopStatus = WorkshopOpenStatus;
  public readonly modalConfirmationType = ModalConfirmationType;

  public openDialog = false;
  public isFavorite = false;
  public canChangeWorkshopStatus: boolean;
  public workshopData: ProviderWorkshopCard | WorkshopCard;

  @Input() public set workshop(workshop: WorkshopCard) {
    this.workshopData = workshop;
    this.imagesService.setWorkshopCoverImage(workshop);
  }

  @Input() public isCabinetView = false;
  @Input() public isHorizontalView = false;
  @Input() public isCreateFormView = false;

  @Output() public deleteWorkshop = new EventEmitter<WorkshopCard | ProviderWorkshopCard>();

  @Select(ParentState.favoriteWorkshops)
  public favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  private favoriteWorkshopId: string;

  public get canOpenWorkshopRecruitment(): boolean {
    return (this.workshopData as ProviderWorkshopCard).takenSeats < (this.workshopData as ProviderWorkshopCard).availableSeats;
  }

  constructor(private store: Store, private dialog: MatDialog, private imagesService: ImagesService) {}

  public ngOnInit(): void {
    if (this.isCabinetView) {
      this.canChangeWorkshopStatus = !(
        this.workshopData.providerOwnership === OwnershipTypes.State ||
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

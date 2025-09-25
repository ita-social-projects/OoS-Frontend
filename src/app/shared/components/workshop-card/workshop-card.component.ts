import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ParentState } from 'shared-store/parent.state';
// eslint-disable-next-line max-len
import { WorkshopSeatsLackModalComponent } from 'shared/components/workshop-card/workshop-seats-lack-modal/workshop-seats-lack-modal.component';
import { Constants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { DraftStatusEnum, FormOfLearningEnum, PayRateTypeEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationDescription, ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { OwnershipTypes } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { WorkshopDraftStatus, WorkshopOpenStatus } from 'shared/enum/workshop';
import { Favorite } from 'shared/models/favorite.model';
import { WorkshopBaseCard, WorkshopDraft, WorkshopDraftCard, WorkshopProviderViewCard } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { ShowMessageBar } from 'shared/store/app.actions';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from 'shared/store/parent.actions';
import { GetWorkshopDraftIdByWorkshopId, UpdateWorkshopStatus, WorkshopDraftSendForModeration } from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { FeaturesList } from 'shared/models/features-list.model';
import { Util } from 'shared/utils/utils';
import { ConfirmationModalWindowComponent } from '../confirmation-modal-window/confirmation-modal-window.component';
import { UnregisteredUserWarningModalComponent } from '../unregistered-user-warning-modal/unregistered-user-warning-modal.component';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {
  @Input() public isCabinetView = false;
  @Input() public isHorizontalView = false;
  @Input() public isCreateFormView = false;

  @Output() public deleteWorkshop = new EventEmitter<WorkshopBaseCard | WorkshopDraftCard>();

  @Select(ParentState.favoriteWorkshops)
  public favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public readonly tooltipPositionAbove = Constants.MAT_TOOL_TIP_POSITION_ABOVE;
  public readonly tooltipPositionBelow = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;

  public readonly OwnershipTypeEnum = OwnershipTypesEnum;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly Role = Role;
  public readonly categoryIcons = CategoryIcons;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly workshopStatus = WorkshopOpenStatus;
  public readonly workshopDraftStatus = WorkshopDraftStatus;
  public readonly draftStatusEnum = DraftStatusEnum;
  public readonly modalConfirmationType = ModalConfirmationType;
  public readonly WorkshopDraft = WorkshopDraft;
  public readonly ModalConfirmationType = ModalConfirmationType;
  public readonly Util = Util;

  public isFavorite = false;
  public isImageBroken = false;
  public canChangeWorkshopStatus: boolean;
  public workshopData: WorkshopBaseCard | WorkshopDraftCard;
  public role: Role;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  private favoriteWorkshopId: string;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly imagesService: ImagesService,
    private readonly router: Router
  ) {}

  public get canOpenWorkshopRecruitment(): boolean {
    return (this.workshopData as WorkshopProviderViewCard).takenSeats < (this.workshopData as WorkshopProviderViewCard).availableSeats;
  }

  @Input()
  public set workshop(workshop: WorkshopBaseCard | WorkshopDraftCard) {
    this.workshopData = workshop;
    this.workshopData._meta = this.imagesService.getCardCoverImage(workshop);
  }

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

  public onKeydown(event: KeyboardEvent, action: () => void): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      action();
      event.preventDefault();
    }
  }

  public onEditKeydown(event: KeyboardEvent): void {
    this.onKeydown(event, () => this.onEdit());
  }

  public onDeleteKeydown(event: KeyboardEvent): void {
    this.onKeydown(event, () => this.onDelete());
  }

  public onLikeKeydown(event: KeyboardEvent): void {
    if (this.role === Role.parent) {
      this.onKeydown(event, () => this.onLike());
    } else {
      this.onKeydown(event, () => this.onOpenDialog());
    }
  }

  public onDislikeKeydown(event: KeyboardEvent): void {
    this.onKeydown(event, () => this.onDisLike());
  }

  public onEdit(): void {
    const draftId = (this.workshopData as WorkshopDraftCard)?.workshopDraftId;
    if (draftId) {
      this.router.navigate(['create/workshop/draft', draftId]);
    } else {
      this.store.dispatch(new GetWorkshopDraftIdByWorkshopId(this.workshopData?.id));
    }
  }

  public onDelete(): void {
    this.deleteWorkshop.emit(this.workshopData);
  }

  public onLike(): void {
    if (this.role === Role.parent) {
      const param = new Favorite(this.workshopData.id, this.store.selectSnapshot(RegistrationState.parent).userId.toString());
      this.store.dispatch([
        new CreateFavoriteWorkshop(param),
        new ShowMessageBar({
          message: SnackbarText.addedWorkshopFavorite,
          type: 'success'
        })
      ]);
      this.isFavorite = !this.isFavorite;
    } else {
      this.onOpenDialog();
    }
  }

  public onDisLike(): void {
    if (this.role === Role.parent) {
      this.store.dispatch([
        new DeleteFavoriteWorkshop(this.favoriteWorkshopId),
        new ShowMessageBar({
          message: SnackbarText.deleteWorkshopFavorite,
          type: 'success'
        })
      ]);
      this.isFavorite = !this.isFavorite;
    }
  }

  public onChangeWorkshopStatus(status: string, type: ModalConfirmationType): void {
    if ((this.canOpenWorkshopRecruitment && type === ModalConfirmationType.openSet) || type === ModalConfirmationType.closeSet) {
      const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type
        }
      });

      dialogRef
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => {
          this.store.dispatch(
            new UpdateWorkshopStatus(
              {
                workshopId: this.workshopData.id,
                status
              },
              this.workshopData.providerId
            )
          );
        });
    } else {
      this.dialog.open(WorkshopSeatsLackModalComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          workshopId: this.workshopData.id,
          workshopTitle: this.workshopData.title
        }
      });
    }
  }

  public onSendForModeration(id: string, type: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: type
      }
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.store.dispatch(new WorkshopDraftSendForModeration(id));
      }
    });
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

  public onImageError(): void {
    this.isImageBroken = true;
    this.workshopData._meta = this.imagesService.getDefaultWorkshopCardImage(this.workshopData);
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
        const favorite = favorites.find((item: Favorite) => item.workshopId === this.workshopData.id);
        if (!!favorite) {
          this.favoriteWorkshopId = favorite.id;
          this.isFavorite = true;
        }
      });
  }
}

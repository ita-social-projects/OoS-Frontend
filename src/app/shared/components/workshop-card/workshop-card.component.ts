import { Favorite } from './../../models/favorite.model';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ApplicationStatus } from '../../enum/applications';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { Role } from '../../enum/role';
import { Application } from '../../models/application.model';
import { WorkshopCard } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop, UpdateStatus } from '../../store/user.actions';
import { ShowMessageBar } from '../../store/app.actions';
import { UserState } from '../../store/user.state';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';
import { Constants } from '../../constants/constants';
import { ImagesService } from '../../services/images/images.service';
import { CategoryIcons } from '../../enum/category-icons';
import { PayRateTypeUkr, RecruitmentStatusUkr } from '../../enum/enumUA/workshop';
import { ConfirmationModalWindowComponent } from '../confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from '../../enum/modal-confirmation';
import { WorkhopStatus } from '../../enum/workshop';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {
  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly Role: typeof Role = Role;
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  readonly categoryIcons = CategoryIcons;
  readonly PayRateTypeUkr = PayRateTypeUkr;
  readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  readonly workhopStatus = WorkhopStatus;
  readonly recruitmentStatusUkr = RecruitmentStatusUkr;
  readonly modalConfirmationType = ModalConfirmationType

  isFavorite: boolean;
  isPrivate: boolean;
  pendingApplicationAmount: number;
  workshopData: WorkshopCard;

  @Input() set workshop(workshop: WorkshopCard) {
    this.workshopData = workshop;
    this.imagesService.setWorkshopCoverImage(workshop);
  }
  @Input() userRoleView: string;
  @Input() isMainPage: boolean;
  @Input() application: Application;
  @Input() isHorizontalView = false;
  @Input() isCreateApplicationView = false;
  @Input() icons: {};

  @Output() deleteWorkshop = new EventEmitter<WorkshopCard>();
  @Output() leaveWorkshop = new EventEmitter<Application>();

  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  role: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private imagesService: ImagesService) { }

  ngOnInit(): void {
    this.isPrivate = this.workshopData.providerOwnership !== 'Common' 
      && this.workshopData.availableSeats !== this.UNLIMITED_SEATS;
    this.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe((role: string) => {
        this.role = role;
        if (this.role === Role.parent) {
          this.getFavoriteWorkshops();
        }
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
      new ShowMessageBar({ message: `Гурток ${this.workshopData.title} додано до Улюблених`, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onDisLike(id: string): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(id),
      new ShowMessageBar({ message: `Гурток ${this.workshopData.title} видалено з Улюблених`, type: 'success' })
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

    dialogRef.afterClosed().subscribe((res:boolean) => {
      if(res) {
        this.store.dispatch(
          new UpdateStatus({ workshopId: this.workshopData.workshopId, status: status }, this.workshopData.providerId)
        );
      }    
    });   
  }

  onWorkshopLeave(): void {
    this.leaveWorkshop.emit(this.application);
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
      ).subscribe((favorites: Favorite[]) => {
        this.isFavorite = !!favorites.find((item: Favorite) => item.workshopId === this.workshopData.workshopId);
      });
  }
}


@Component({
  selector: 'app-workshop-dialog',
  template: `
    <div mat-dialog-content fxLayoutAlign="center" class="dialog-title">
      <p>Для того щоб додати в улюблені будь ласка зареєструйтеся на порталі. Дякуємо</p>
    </div>
    <div mat-dialog-actions fxLayoutAlign="center">
      <button mat-raised-button mat-dialog-close class="dialog-action-button">Повернутись</button>
    </div>`,
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardDialog { }

import { Favorite } from './../../models/favorite.model';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ApplicationStatus } from '../../enum/applications';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { Role } from '../../enum/role';
import { Application } from '../../models/application.model';
import { WorkshopCard } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from '../../store/user.actions';
import { ShowMessageBar } from '../../store/app.actions';
import { UserState } from '../../store/user.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CategoryIcons } from '../../enum/category-icons';
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';
import { environment } from 'src/environments/environment';
import { Constants } from '../../constants/constants';

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
  readonly categoryIcons = CategoryIcons;
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  private readonly authServer: string = environment.serverUrl;

  favoriteWorkshops: Favorite[];
  isFavorite: boolean;
  favoriteWorkshopId: Favorite;
  pendingApplicationAmount: number;
  role: string;
  coverImageUrl: string;

  @Input() workshop: WorkshopCard;
  @Input() userRoleView: string;
  @Input() isMainPage: boolean;
  @Input() application: Application;
  @Input() isHorizontalView = false;
  @Input() isCreateApplicationView = false;
  @Input() icons: {};
  @Input() set pendingApplications(applications: Application[]) {
    if (applications?.length) {
      this.pendingApplicationAmount = applications.filter((application: Application) => {
        return (application.workshopId === this.workshop.workshopId && application.status === ApplicationStatus.Pending);
      }).length;
    } else {
      this.pendingApplicationAmount = 0;
    }
  };

  @Output() deleteWorkshop = new EventEmitter<WorkshopCard>();
  @Output() leaveWorkshop = new EventEmitter<Application>();

  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.role)
  role$: Observable<string>;
  @Select(UserState.selectedWorkshop)
  workshop$: Observable<WorkshopCard>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.workshop) {
      this.workshop$.pipe(
        filter((workshop: WorkshopCard) => !!workshop),
        takeUntil(this.destroy$))
        .subscribe((workshop: WorkshopCard) => {
          this.workshop = workshop;
          this.getData();
        });
    } else {
      this.getData();
    }
  }

  onDelete(): void {
    this.deleteWorkshop.emit(this.workshop);
  }

  onLike(): void {
    const param = new Favorite(
      this.workshop.workshopId,
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
    );
    this.store.dispatch([
      new CreateFavoriteWorkshop(param),
      new ShowMessageBar({ message: `Гурток ${this.workshop.title} додано до Улюблених`, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
  }

  onDisLike(id: string): void {
    this.store.dispatch([
      new DeleteFavoriteWorkshop(id),
      new ShowMessageBar({ message: `Гурток ${this.workshop.title} видалено з Улюблених`, type: 'success' })
    ]);
    this.isFavorite = !this.isFavorite;
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

  private getData(): void {
    this.favoriteWorkshops$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites: Favorite[]) => {
        this.favoriteWorkshops = favorites;
        this.isFavorite = !!this.favoriteWorkshops?.find((item: Favorite) => item.workshopId === this.workshop?.workshopId);
      });
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: string) => this.role = role);
    this.getCoverImageUrl();
  }

  private getCoverImageUrl(): void {
    if (this.workshop.coverImageId) {
      this.coverImageUrl = this.authServer + Constants.IMG_URL + this.workshop.coverImageId;
    } else {
      this.coverImageUrl = this.categoryIcons[this.workshop.directionId];
    }
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

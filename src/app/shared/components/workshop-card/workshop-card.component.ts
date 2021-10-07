import { Favorite } from './../../models/favorite.model';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ApplicationStatus } from '../../enum/applications';
import { ApplicationTitles} from 'src/app/shared/enum/enumUA/applications'
import { Role } from '../../enum/role';
import { Application } from '../../models/application.model';
import { WorkshopCard } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from '../../store/user.actions';
import { ShowMessageBar } from '../../store/app.actions';
import { UserState } from '../../store/user.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Provider } from '../../models/provider.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {

  readonly applicationTitles = ApplicationTitles;
  readonly applicationStatus = ApplicationStatus;
  readonly role: typeof Role = Role;
  public below: string = 'below';

  @Input() workshop: WorkshopCard;
  @Input() userRole: string;
  @Input() isMainPage: boolean;
  @Input() application: Application;
  @Input() parent: boolean;
  @Input() isHorizontalView: boolean = false;
  @Input() isCreateApplicationView: boolean = true;


  @Output() deleteWorkshop = new EventEmitter<WorkshopCard>();
  @Output() leaveWorkshop = new EventEmitter<Application>();


  status: string = 'approved'; //temporary
  favoriteWorkshops: Favorite[];
  isFavorite: boolean;
  favoriteWorkshopId: Favorite;
  isProvider: boolean;

  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
 
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.favoriteWorkshops$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
        this.favoriteWorkshops = favorites;
        this.favoriteWorkshopId = this.favoriteWorkshops?.find(item => item.workshopId === this.workshop?.workshopId);
      });
    this.isFavorite = !!this.favoriteWorkshopId;

    this.provider$
      .pipe(takeUntil(this.destroy$))
      .subscribe((provider)=> this.isProvider = !!provider);
  }

  onEdit(): void {
    console.log("I edit it")
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

  onDisLike(id: number): void {
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
}

@Component({
  selector: 'app-workshop-dialog',
  template: `
    <div mat-dialog-content fxLayoutAlign="center" class="dialog-title">
      <p>Для того щоб додати в улюблені будь ласка зареєструйтесь на порталі. Дякуемо!</p>
    </div>
    <div mat-dialog-actions fxLayoutAlign="center">
      <button mat-raised-button mat-dialog-close class="dialog-action-button">Повернутись</button>
    </div>`,
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardDialog { }

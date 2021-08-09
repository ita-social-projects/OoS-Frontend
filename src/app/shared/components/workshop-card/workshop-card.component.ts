import { Favorite } from './../../models/favorite.model';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ApplicationStatus, ApplicationStatusUkr } from '../../enum/applications';
import { Role } from '../../enum/role';
import { Application } from '../../models/application.model';
import { WorkshopCard } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { CreateFavoriteWorkshop, DeleteFavoriteWorkshop } from '../../store/user.actions';
import { ShowMessageBar } from '../../store/app.actions';
import { UserState } from '../../store/user.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnDestroy {

  readonly applicationStatusUkr = ApplicationStatusUkr;
  readonly applicationStatus = ApplicationStatus;
  readonly role: typeof Role = Role;
  public below: string = 'below';

  @Input() workshop: WorkshopCard;
  @Input() userRole: string;
  @Input() isMainPage: boolean;
  @Input() application: Application;
  @Input() parent: boolean;


  @Output() deleteWorkshop = new EventEmitter<WorkshopCard>();
  @Output() leaveWorkshop = new EventEmitter<Application>();


  status: string = 'approved'; //temporary
  favoriteWorkshops: Favorite[];
  isFavorite: boolean;
  favoriteWorkshopId: Favorite;
 
  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.favoriteWorkshops$
    .pipe(takeUntil(this.destroy$))
    .subscribe((favorites)=> {
      this.favoriteWorkshops = favorites;
      this.favoriteWorkshopId = this.favoriteWorkshops?.find(item => item.workshopId === this.workshop.workshopId);
    });
    this.isFavorite = !!this.favoriteWorkshopId;
  }

  onEdit(): void {
    console.log("I edit it")
  }

  onDelete(): void {
    this.deleteWorkshop.emit(this.workshop);
  }

  onLike(): void {
    const param = new Favorite (
      this.workshop.workshopId, 
      this.store.selectSnapshot(RegistrationState.parent).userId.toString()
      )
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

  ngOnDestroy():void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

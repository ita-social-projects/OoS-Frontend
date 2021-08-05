import { Favorite } from './../../../../shared/models/favorite.model';
import { UserState } from 'src/app/shared/store/user.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegistrationState } from 'src/app/shared/store/registration.state';


@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent implements OnInit, OnDestroy {
  public favoriteWorkshops: Favorite[];
  public workshops: WorkshopCard[];
  public favoriteWorkshop: WorkshopCard[] = [];
  public parent: boolean;

  @Select(UserState.favoriteWorkshops)
  favoriteWorkshops$: Observable<Favorite[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { 
    this.parent = this.store.selectSnapshot(RegistrationState.parent) !== undefined;
    //TODO: waiting for new Workshop model from back-end 
    this.favoriteWorkshops$
    .pipe(takeUntil(this.destroy$))
    .subscribe((favorites)=> this.favoriteWorkshops = favorites);

    this.workshops = this.store.selectSnapshot(FilterState.filteredWorkshops); 

    this.favoriteWorkshops?.forEach(elem => {
      if(this.workshops.find(item => item.workshopId === elem.workshopId) !== undefined) {
      this.favoriteWorkshop.push(this.workshops.find(item => item.workshopId === elem.workshopId));
      }
    });
  }

  ngOnInit(): void { }

  ngOnDestroy():void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

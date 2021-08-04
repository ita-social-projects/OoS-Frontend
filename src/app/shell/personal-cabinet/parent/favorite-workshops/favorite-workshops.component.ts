import { Favorite } from './../../../../shared/models/favorite.model';
import { UserState } from 'src/app/shared/store/user.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent implements OnInit, OnDestroy {
  public favorite: Favorite[];
  public workshops: WorkshopCard[];
  public favoriteWorkshop: WorkshopCard[] = [];

  @Select(UserState.favorite)
  favorite$: Observable<Favorite[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { 
    //TODO: waiting for new Workshop model from back-end 
    this.favorite$
    .pipe(takeUntil(this.destroy$))
    .subscribe((favorites)=> this.favorite = favorites);

    this.workshops = this.store.selectSnapshot(FilterState.filteredWorkshops); 

    this.favorite?.forEach(elem => {
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

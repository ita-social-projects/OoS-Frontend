import { UserState } from 'src/app/shared/store/user.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Observable, Subject } from 'rxjs';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent implements OnInit, OnDestroy {

  @Select(UserState.favoriteWorkshopsCard)
  favoriteWorkshopsCard$: Observable<WorkshopCard[]>;

  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;

  parent: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.isParent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

import { UserState } from 'src/app/shared/store/user.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Observable, Subject } from 'rxjs';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Role } from 'src/app/shared/enum/role';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { OnPageChangeWorkshops } from 'src/app/shared/store/paginator.actions';
import { PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent implements OnInit, OnDestroy {
  readonly Role: typeof Role = Role;
  readonly noFavoriteWorkshops = NoResultsTitle.noFavoriteWorkshops;

  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  @Select(UserState.favoriteWorkshopsCard)
  favoriteWorkshopsCard$: Observable<WorkshopCard[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath(
        {
          name: NavBarName.Favorite,
          isActive: false,
          disable: true,
        }
      )
    );       
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeWorkshops(page));
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Observable } from 'rxjs';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { Role } from 'src/app/shared/enum/role';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { OnPageChangeWorkshops } from 'src/app/shared/store/paginator.actions';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { ParentComponent } from '../parent.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { takeUntil } from 'rxjs/operators';
import { ParentState } from 'src/app/shared/store/parent.state.';
import { DeleteFavoriteWorkshop, GetFavoriteWorkshopsByUserId } from 'src/app/shared/store/parent.actions';

@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss'],
})
export class FavoriteWorkshopsComponent extends ParentComponent implements OnInit, OnDestroy {
  readonly Role = Role;
  readonly noFavoriteWorkshops = NoResultsTitle.noFavoriteWorkshops;

  @Select(ParentState.favoriteWorkshopsCard)
  favoriteWorkshopsCard$: Observable<WorkshopCard[]>;

  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(protected store: Store, protected matDialog: MatDialog, private actions$: Actions) {
    super(store, matDialog);
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Favorite,
        isActive: false,
        disable: true,
      })
    );
  }

  initParentData(): void {
    this.store.dispatch(new GetFavoriteWorkshopsByUserId());

    this.actions$
      .pipe(ofAction(DeleteFavoriteWorkshop))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetFavoriteWorkshopsByUserId()));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeWorkshops(page));
  }
}

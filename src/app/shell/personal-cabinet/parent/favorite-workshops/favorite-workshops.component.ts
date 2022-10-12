import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ParentComponent } from '../parent.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../../../../shared/enum/role';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { WorkshopCard } from '../../../../shared/models/workshop.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { OnPageChangeWorkshops } from '../../../../shared/store/paginator.actions';
import { GetFavoriteWorkshopsByUserId, DeleteFavoriteWorkshop } from '../../../../shared/store/parent.actions';
import { ParentState } from '../../../../shared/store/parent.state.';

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

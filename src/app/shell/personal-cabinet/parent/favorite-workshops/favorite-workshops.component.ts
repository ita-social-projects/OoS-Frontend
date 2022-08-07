import { UserState } from 'src/app/shared/store/user.state';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
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

@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent extends ParentComponent implements OnInit, OnDestroy {
  readonly Role  = Role;
  readonly noFavoriteWorkshops = NoResultsTitle.noFavoriteWorkshops;

  @Select(UserState.favoriteWorkshopsCard)
  favoriteWorkshopsCard$: Observable<WorkshopCard[]>;
  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected addNavPath(): void {
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

  initParentData(): void { }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new OnPageChangeWorkshops(page));
  }
}

import { UserState } from 'src/app/shared/store/user.state';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Pipe } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Observable, Subject } from 'rxjs';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { map, scan, takeUntil, count } from 'rxjs/operators';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { Util } from 'src/app/shared/utils/utils';
import { Constants } from 'src/app/shared/constants/constants';


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
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;
  parent: boolean;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.isParent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
  }
}

import { Util } from 'src/app/shared/utils/utils';
import { Constants } from './../../shared/constants/constants';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { SetCity, GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Workshop, WorkshopCard } from '../../shared/models/workshop.model';
import { GetDirections, GetTopDirections } from 'src/app/shared/store/meta-data.actions';
import { count, debounceTime, distinctUntilChanged, reduce, scan, takeUntil, tap, map } from 'rxjs/operators';
import { GetFilteredWorkshops } from './../../shared/store/filter.actions';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})

export class MainComponent implements OnInit {
  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;
  @Select(MetaDataState.topDirections)
  topDirections$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  public parent: boolean;
  getEmptyCards = Util.getEmptyCards;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;
  constructor(
    private store: Store,
    private actions$: Actions,
  ) { }


  ngOnInit(): void {
    this.store.dispatch([
      new GetTopDirections(),
      new GetTopWorkshops(Constants.ITEMS_PER_PAGE)
    ]);

    this.actions$.pipe(ofAction(SetCity))
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetTopWorkshops(Constants.ITEMS_PER_PAGE)));

    this.isParent$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

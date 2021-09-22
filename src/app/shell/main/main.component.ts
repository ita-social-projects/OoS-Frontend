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
  @ViewChild('WorkshopsWrap') WorkshopsWrap: ElementRef;
  public parent: boolean;


  constructor(
    private store: Store,
    private actions$: Actions,
  ) { }


  ngOnInit(): void {
    this.store.dispatch([
      new GetTopDirections(),
      new GetTopWorkshops(Constants.WORKSHOPS_PER_PAGE)
    ]);

    this.actions$.pipe(ofAction(SetCity))
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetTopWorkshops(Constants.WORKSHOPS_PER_PAGE)));

    this.isParent$
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(parent => this.parent = parent);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  emptyWorkshops(): Array<Workshop> {
    let amountCardsInRow = 0;
    let workshops = [];
    let amountWorkshops = 0;
    this.topWorkshops$.pipe(map(x => workshops.push(x))).subscribe();
    amountWorkshops = workshops[0].length;
    if (this.WorkshopsWrap) {
      amountCardsInRow = Math.floor(Number((this.WorkshopsWrap.nativeElement.clientWidth) / 350));
    }
    let emptyWorkshops = (amountCardsInRow - amountWorkshops % amountCardsInRow) !== amountCardsInRow ? (amountCardsInRow - amountWorkshops % amountCardsInRow) : 0;
    return new Array(emptyWorkshops | 0);
  }
}

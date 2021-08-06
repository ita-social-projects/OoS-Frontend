import { Select, Store } from '@ngxs/store';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { WorkshopCard } from '../../../shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {
  
  @Input() workshops: WorkshopCard[];

  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;

  currentPage: number = 1;
  parent: boolean;

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
}

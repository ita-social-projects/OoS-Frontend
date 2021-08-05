import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { Workshop, WorkshopCard, WorkshopFilterCard } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Input() workshops: WorkshopFilterCard;
  currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };

  constructor(private store: Store) { }

  ngOnInit(): void { }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
  }
}

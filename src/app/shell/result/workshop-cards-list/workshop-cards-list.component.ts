import { Store } from '@ngxs/store';
import { Component, Input, OnInit } from '@angular/core';
import { WorkshopCard } from '../../../shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Input() workshops: WorkshopCard[];
  currentPage: number = 1;
  parent: boolean;

  constructor(public store: Store) {
    this.parent = this.store.selectSnapshot(RegistrationState.parent) !== undefined;
   }

  ngOnInit(): void { }
}

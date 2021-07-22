import { Component, Input, OnInit } from '@angular/core';
import { Workshop, WorkshopCard } from '../../../shared/models/workshop.model';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Input() workshops: WorkshopCard[];
  currentPage: number = 1;

  constructor() { }

  ngOnInit(): void { }
}

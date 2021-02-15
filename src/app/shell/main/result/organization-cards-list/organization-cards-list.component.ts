import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { orgCard, ORGCARDS } from 'src/app/mock-org-cards';

@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {
  public cards: orgCard[];

  constructor() {}
  
  ngOnInit(): void {
    this.getCards().subscribe(cards => this.cards = cards);
  }

  getCards(): Observable<orgCard[]> {
    return of(ORGCARDS);
  }
}

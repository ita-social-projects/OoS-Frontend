import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { orgCard, ORGCARDS } from 'src/app/mock-org-cards';

@Component({
  selector: 'app-organization-card-list',
  templateUrl: './organization-card-list.component.html',
  styleUrls: ['./organization-card-list.component.scss']
})
export class OrganizationCardListComponent implements OnInit {
  public cards: orgCard[];
  
  constructor() { }

  ngOnInit(): void {
    this.getCards().subscribe(cards => this.cards = cards);
  }

  getCards(): Observable<orgCard[]> {
    return of(ORGCARDS);
  }
}

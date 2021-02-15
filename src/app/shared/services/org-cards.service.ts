import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ORGCARDS } from 'src/app/mock-org-cards';

import { orgCard } from 'src/assets/mock-org-cards';

@Injectable({
  providedIn: 'root'
})
export class OrgCardsService {

  constructor(/* private http: HttpClient */) { }

  getCards(): Observable<orgCard[]> {
    /* return this.http.get<orgCard[]>('src/assets/mock-org-cards.ts') */
    return of(ORGCARDS)
  }
}

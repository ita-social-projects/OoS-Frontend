import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { activitiesCard } from '../../models/org-card.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesCardsService {

  dataUrl = '/assets/mock-activities-cards.json'

  constructor(private http: HttpClient) { }

  getCards(): Observable<activitiesCard[]> {
    return this.http.get<activitiesCard[]>(this.dataUrl)
  }
}

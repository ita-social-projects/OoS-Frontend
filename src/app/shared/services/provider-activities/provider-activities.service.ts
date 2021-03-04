import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { actCard } from '../../models/activities-card.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderActivitiesService {

  dataUrl = 'http://localhost:5000/Workshop/GetWorkshops'

  constructor(private http: HttpClient) { }

  getCards(): Observable<actCard[]> {
    return this.http.get<actCard[]>(this.dataUrl)
  }
}

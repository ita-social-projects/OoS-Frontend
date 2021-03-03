import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { orgCard } from '../../models/org-card.model';

@Injectable({
  providedIn: 'root'
})
export class OrgCardsService {

  dataUrl = 'http://localhost:5000/Workshop/GetWorkshops'

  constructor(private http: HttpClient) { }

  getCards(): Observable<orgCard[]> {
    return this.http.get<orgCard[]>(this.dataUrl)
  }
}

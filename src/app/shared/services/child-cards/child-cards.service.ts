import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChildCard} from '../../models/child-card.model'


@Injectable({
  providedIn: 'root'
})
export class ChildCardService {

  dataUrl = '/assets/mock-child-cards.json'

  constructor(private http: HttpClient) { }

  getCards(): Observable<ChildCard[]> {
    return this.http.get<ChildCard[]>(this.dataUrl)
  }
}
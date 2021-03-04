import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChildCard} from '../../models/child-card.model'


@Injectable({
  providedIn: 'root'
})
export class ChildCardService {

  dataUrl = 'http://localhost:5000/Child/GetChildren'

  constructor(private http: HttpClient) { }

  getCards(): Observable<ChildCard[]> {
    return this.http.get<ChildCard[]>(this.dataUrl)
  }
}
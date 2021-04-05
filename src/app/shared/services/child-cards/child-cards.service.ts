import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChildCard} from '../../models/child.model'


@Injectable({
  providedIn: 'root'
})
export class ChildCardService {

  dataUrl = '/Child/Get'

  constructor(private http: HttpClient) { }

  getCards(): Observable<ChildCard[]> {
    return this.http.get<ChildCard[]>('/Child/Get')
  }
}
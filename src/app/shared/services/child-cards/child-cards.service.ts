import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Child} from '../../models/child.model'


@Injectable({
  providedIn: 'root'
})
export class ChildCardService {

  dataUrl = '/Child/Get'

  constructor(private http: HttpClient) { }

  getCards(): Observable<Child[]> {
    return this.http.get<Child[]>('/Child/Get')
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parent } from '../../models/parent.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  constructor(private http: HttpClient) { }

  updateParent(parent: Parent): Observable<any> {
    return this.http.put('/Parent/Update', parent);
  }
}

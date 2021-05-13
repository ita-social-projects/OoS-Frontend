import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';

const dataUrl = '/assets/mock-child-cards.json';

@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  constructor(private http: HttpClient) { }

  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>('/Child/Get');
  }

  createChildren(child: Child): void {
    this.http.post('/Child/Create', child);
  }
}

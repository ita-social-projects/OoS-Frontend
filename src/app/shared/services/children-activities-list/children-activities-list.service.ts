import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChildActivities } from '../../models/child-activities.model';

@Injectable({
  providedIn: 'root'
})
export class ChildrenActivitiesListService {

  dataUrl = '/assets/mock-children-list.json';

  constructor(private http: HttpClient) { }

  getChildrenList(): Observable<ChildActivities[]> {
    return this.http.get<ChildActivities[]>(this.dataUrl)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actCard } from '../../models/activities-card.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderActivitiesService {

  constructor(private http: HttpClient) { }

  getCards(): Observable<actCard[]> {
    return this.http.get<actCard[]>('/Workshop/Get')
  }

  createWorkshop( workshop ): void {
    this.http.post('/Workshop/Create', workshop).subscribe(workshop => console.log(workshop));
  }
}

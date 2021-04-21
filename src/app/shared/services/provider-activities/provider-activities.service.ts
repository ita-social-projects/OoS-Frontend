import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderActivitiesService {

  constructor(private http: HttpClient) { }

  getCards(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>('/Workshop/Get');
  }

  createWorkshop(workshop): void {
    this.http.post('/Workshop/Create', workshop).subscribe(workshop => console.log(workshop));
  }
}

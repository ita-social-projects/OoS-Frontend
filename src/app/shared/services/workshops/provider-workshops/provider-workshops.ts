import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderWorkshopsService {

  constructor(private http: HttpClient) { }

  getWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>('/Workshop/Get')
  }

  createWorkshop( workshop ): any {
   return this.http.post('/Workshop/Create', workshop).subscribe(workshop => console.log(workshop));
  }

}

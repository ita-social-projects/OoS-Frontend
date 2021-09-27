import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop, WorkshopCard } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {

  tepmUrl = '/Workshop/Get';

  constructor(private http: HttpClient) { }

  /**
  * This method get workshops by Provider id
  * @param id
  */
  getWorkshopsByProviderId(id: number): Observable<WorkshopCard[]> {
    return this.http.get<WorkshopCard[]>(`/Workshop/GetByProviderId/${id}`);
  }

  /**
  * This method get workshops by Workshop id
  * @param id
  */
  getWorkshopById(id: number): Observable<Workshop> {
    return this.http.get<Workshop>(`/Workshop/GetById/${id}`);
  }

  /**
  * This method create workshop
  * @param Workshop
  */
  createWorkshop(workshop: Workshop): Observable<Object> {
    return this.http.post('/Workshop/Create', workshop);
  }

  /**
  * This method delete workshop by Workshop id
  * @param id
  */
  deleteWorkshop(id: number): Observable<Object> {
    return this.http.delete(`/Workshop/Delete/${id}`);
  }

  /**
  * This method update workshop
  * @param Workshop
  */
  updateWorkshop(workshop: Workshop): Observable<Object> {
    return this.http.put('/Workshop/Update', workshop);
  }

}

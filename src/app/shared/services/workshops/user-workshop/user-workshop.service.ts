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
   * @param id: number
   */
  getWorkshopsByProviderId(id: string): Observable<WorkshopCard[]> {
    return this.http.get<WorkshopCard[]>(`/Workshop/GetByProviderId/${id}`);
  }

  /**
   * This method get workshops by Workshop id
   * @param id: number
   */
  getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`/Workshop/GetById/${id}`);
  }

  /**
   * This method create workshop
   * @param workshop: Workshop
   */
  createWorkshop(workshop: Workshop): Observable<object> {
    return this.http.post('/Workshop/Create', workshop);
  }

  /**
   * This method delete workshop by Workshop id
   * @param id: number
   */
  deleteWorkshop(id: string): Observable<object> {
    return this.http.delete(`/Workshop/Delete/${id}`);
  }

  /**
   * This method update workshop
   * @param workshop: Workshop
   */
  updateWorkshop(workshop: Workshop): Observable<object> {
    return this.http.put('/Workshop/Update', workshop);
  }

}

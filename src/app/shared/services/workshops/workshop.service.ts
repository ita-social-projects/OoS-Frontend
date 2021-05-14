import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }
  /**
  * This method get all workshops
  */
  getWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>('/Workshop/Get');
  }

  /**
  * This method get workshops by User id
  * @param id
  */
  getWorkshopsById(id: number): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`/Workshop/GetById/${id}`);
  }

  /**
  * This method create workshop
  * @param Workshop
  */
  createWorkshop(workshop: Workshop): any {
    return this.http.post('/Workshop/Create', workshop);
  }

  /**
  * This method delete workshop by Workshop id
  * @param id
  */
  deleteWorkshop(id: number): any {
    return this.http.delete(`/Workshop/Delete/${id}`);
  }

}

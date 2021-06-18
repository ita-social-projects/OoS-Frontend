import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {

  tepmUrl = '/Workshop/Get';

  constructor(private http: HttpClient) { }
  /**
  * This method get workshops by User id
  * @param id
  */
  getWorkshopsById(id: number): Observable<Workshop> {
    const dataUrl = `/Workshop/GetById/${id}`;
    return this.http.get<Workshop>(dataUrl);
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
    const dataUrl = `/Workshop/Delete/${id}`;
    return this.http.delete(dataUrl);
  }

  /**
  * This method update workshop
  * @param Workshop
  */
  updateWorkshop(workshop: Workshop): Observable<Object> {
    return this.http.put('/Workshop/Update', workshop);
  }

}

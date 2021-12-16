import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop, WorkshopCard, WorkshopMultiForm } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {

  tepmUrl = '/Workshop/Get';

  constructor(private http: HttpClient) { }

  /**
   * This method get workshops by Provider id
   * @param id: string
   */
  getWorkshopsByProviderId(id: string): Observable<WorkshopCard[]> {
    return this.http.get<WorkshopCard[]>(`/api/v1/Workshop/GetByProviderId/${id}`);
  }

  /**
   * This method get workshops by Workshop id
   * @param id: string
   */
  getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`/api/v1/Workshop/GetById/${id}`);
  }

  /**
   * This method create workshop
   * @param workshop: Workshop
   */
  createWorkshop(workshop: WorkshopMultiForm): Observable<object> {
    const formData = new FormData();
    Object.keys(workshop.main).forEach((key: string) => {
      formData.append(key, JSON.stringify(workshop.main[key]));
    });

    formData.append(workshop.imageFiles, JSON.stringify(workshop.imageFiles));


    return this.http.post('/api/v2/Workshop/Create', formData)
  }

  /**
   * This method delete workshop by Workshop id
   * @param id: string
   */
  deleteWorkshop(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Workshop/Delete/${id}`);
  }

  /**
   * This method update workshop
   * @param workshop: Workshop
   */
  updateWorkshop(workshop: Workshop): Observable<object> {
    return this.http.put('/api/v1/Workshop/Update', workshop);
  }

}

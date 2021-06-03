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
  getWorkshopsById(id: number): Observable<Workshop[]> {
    const dataUrl = `/Workshop/GetById/${id}`;
    return this.http.get<Workshop[]>(this.tepmUrl);
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
    const dataUrl = `Workshop/Delete/${id}`;
    return this.http.delete(dataUrl);
  }

}

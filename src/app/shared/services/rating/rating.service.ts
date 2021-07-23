import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rate } from '../../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  /**
  * This method get Rate pf entity by its entityId
  * @param entityType: string
  * @param entityId: number
  */
  getRateByEntityId(entityType: string, entityId: number): Observable<Rate[]> {
    return this.http.get<Rate[]>(`/Rating/GetByEntityId/${entityType}/${entityId}`);
  }

  /**
  * This method create workshop
  * @param Rate
  */
  createRate(rate: Rate): Observable<Object> {
    return this.http.post('/Rating/Create', rate);
  }

  /**
  * This method update workshop
  * @param Rate
  */
  updateRate(rate: Rate): Observable<Object> {
    return this.http.put('/Rating/Update', rate);
  }
}

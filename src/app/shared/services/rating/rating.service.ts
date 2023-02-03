import { SearchResponse } from './../../models/search.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PaginationElement } from '../../models/paginationElement.model';
import { Rate, RateParameters } from '../../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private http: HttpClient, private store: Store) {}

  getRateByEntityId(rateParameters: RateParameters): Observable<SearchResponse<Rate[]>> {
    const params = new HttpParams().set('Size', rateParameters.size.toString()).set('From', rateParameters.from.toString());
    const body = { params };
    return this.http.get<SearchResponse<Rate[]>>(
      `/api/v1/Rating/GetByEntityId/${rateParameters.entityType}/${rateParameters.entityId}`,
      body
    );
  }

  /**
   * This method create Rate
   * @param rate: Rate
   */
  createRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/api/v1/Rating/Create', rate);
  }

  /**
   * This method update Rate
   * @param rate: Rate
   */
  updateRate(rate: Rate): Observable<object> {
    return this.http.put('/api/v1/Rating/Update', rate);
  }

  /**
   * This method Check if the workshop is reviewed by parent.
   * @param parentId string
   * @param workshopId string
   */
  getReviewedStatus(parentId: string, workshopId: string): Observable<boolean> {
    return this.http.get<boolean>('/api/v1/Rating/IsReviewed', {
      params: {
        parentId,
        workshopId
      }
    });
  }
}

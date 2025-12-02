import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Rate, RateParameters } from 'shared/models/rating';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private http: HttpClient) {}

  public getWorkshopRateByEntityId(rateParameters: RateParameters): Observable<SearchResponse<Rate[]>> {
    const params = new HttpParams().set('Size', rateParameters.size.toString()).set('From', rateParameters.from.toString());
    const body = { params };
    return this.http.get<SearchResponse<Rate[]>>(`/api/v1/Rating/GetByEntityId/workshop/${rateParameters.entityId}`, body);
  }

  /**
   * This method create Rate
   * @param rate: Rate
   */
  public createRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/api/v1/Rating/Create', rate);
  }

  /**
   * This method update Rate
   * @param rate: Rate
   */
  public updateRate(rate: Rate): Observable<object> {
    return this.http.put('/api/v1/Rating/Update', rate);
  }

  /**
   * This method delete Rate by Id
   * @param rate: Rate
   */
  public deleteRate(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/Rating/Delete/${id}`);
  }

  /**
   * This method Check if the workshop is reviewed by parent.
   * @param parentId string
   * @param workshopId string
   */
  public getReviewedStatus(parentId: string, workshopId: string): Observable<boolean> {
    return this.http.get<boolean>('/api/v1/Rating/IsReviewed', {
      params: {
        parentId,
        workshopId
      }
    });
  }
}
